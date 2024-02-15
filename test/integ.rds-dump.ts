import { IntegTest } from "@aws-cdk/integ-tests-alpha";
import { App, Stack, StackProps } from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as events from "aws-cdk-lib/aws-events";
import * as rds from "aws-cdk-lib/aws-rds";
import { DbEngine, RdsDump } from "../src";

const app = new App();

class TestStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, "Vpc", {
      maxAzs: 2,
    });

    const cluster = new rds.DatabaseCluster(this, "Cluster", {
      engine: rds.DatabaseClusterEngine.auroraMysql({
        version: rds.AuroraMysqlEngineVersion.VER_3_02_0,
      }),
      writer: rds.ClusterInstance.provisioned("writer"),
      vpc,
    });

    new RdsDump(this, "RdsDump", {
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
  }
}

const stack = new TestStack(app, "test-stack");

new IntegTest(app, "Test", {
  testCases: [stack],
});
