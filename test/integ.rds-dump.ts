import { IntegTest } from "@aws-cdk/integ-tests-alpha";
import { App, Stack, StackProps } from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as events from "aws-cdk-lib/aws-events";
import * as nodejsFunction from "aws-cdk-lib/aws-lambda-nodejs";
import * as rds from "aws-cdk-lib/aws-rds";
import { DbEngine, RdsDump } from "../src";

const app = new App();
const stack = new Stack(app, "test-stack");

const vpc = new ec2.Vpc(stack, "Vpc", {
  maxAzs: 2,
});

const cluster = new rds.DatabaseCluster(stack, "Cluster", {
  engine: rds.DatabaseClusterEngine.auroraMysql({
    version: rds.AuroraMysqlEngineVersion.VER_3_02_0,
  }),
  writer: rds.ClusterInstance.provisioned("writer"),
  vpc,
});

const rdsDump = new RdsDump(stack, "RdsDump", {
  dbEngine: DbEngine.MYSQL,
  rdsCluster: cluster,
  databaseName: "testDatabase",
  schedule: events.Schedule.cron({ minute: "0", hour: "0" }),
  lambdaEnv: {
    ENV_VAR: "value",
  },
  createSecretsManagerVPCEndpoint: true,
  createS3GatewayEndpoint: true,
});

const setupDbHandler = new nodejsFunction.NodejsFunction(
  stack,
  "SetupDbHandler",
  {
    entry: "setupDb.ts",
    handler: "handler",
    bundling: {
      target: "es2020",
      externalModules: ["aws-sdk"],
      loader: { ".ts": "ts" },
    },
    environment: {
      CLUSTER_SECRET_ARN: cluster.secret?.secretArn ?? "",
    },
  },
);
cluster.secret?.grantRead(setupDbHandler);

const integ = new IntegTest(app, "Test", {
  testCases: [stack],
});
integ.assertions
  .invokeFunction({
    functionName: setupDbHandler.functionName,
  })
  .waitForAssertions();

integ.assertions
  .invokeFunction({
    functionName: rdsDump.dumpLambdaName,
  })
  .waitForAssertions();
