import { ExpectedResult, IntegTest } from "@aws-cdk/integ-tests-alpha";
import { App, Stack } from "aws-cdk-lib";
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

const clusterSecretId = cluster.secret?.secretName;
if (clusterSecretId == null || clusterSecretId === "") {
  throw new Error("Cluster secret id not found");
}

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
      RDS_ENDPOINT: cluster.clusterEndpoint.hostname,
      RDS_SECRET_ID: clusterSecretId,
    },
    vpc,
  },
);
cluster.secret?.grantRead(setupDbHandler);
cluster.connections.allowFrom(setupDbHandler, ec2.Port.tcp(3306));

const integ = new IntegTest(app, "Test", {
  testCases: [stack],
});
const setupDbAssertion = integ.assertions.invokeFunction({
  functionName: setupDbHandler.functionName,
});
setupDbAssertion.expect(
  ExpectedResult.objectLike({
    StatusCode: 200,
    Payload: { message: "Database and table created successfully!" },
  }),
);

const dumpAssertion = integ.assertions.invokeFunction({
  functionName: rdsDump.dumpLambdaName,
});
dumpAssertion.expect(
  ExpectedResult.objectLike({
    StatusCode: 200,
    Payload: { message: "DB dump has finished successfully!" },
  }),
);
