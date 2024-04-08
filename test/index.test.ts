import { App, Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as events from "aws-cdk-lib/aws-events";
import * as rds from "aws-cdk-lib/aws-rds";
import { DbEngine, RdsDump, RdsDumpProps } from "../src";

test("RdsDump construct creates resources", () => {
  const app = new App();
  const stack = new Stack(app);

  const rdsCluster = new rds.DatabaseCluster(stack, "DatabaseClusterId", {
    engine: rds.DatabaseClusterEngine.auroraMysql({
      version: rds.AuroraMysqlEngineVersion.VER_3_06_0,
    }),
    vpc: new ec2.Vpc(stack, "VpcId"),
    writer: rds.ClusterInstance.serverlessV2("writerInstance"),
  });

  const rdsDumpProps: RdsDumpProps = {
    dbEngine: DbEngine.MYSQL,
    rdsCluster: rdsCluster,
    schedule: events.Schedule.cron({ minute: "0", hour: "0" }),
    databaseName: "testDB",
    secretId: "testSecretId",
    createSecretsManagerVPCEndpoint: false,
  };

  new RdsDump(stack, "RdsDumpId", rdsDumpProps);

  // Check if the necessary resources have been created in the stack
  const assert = Template.fromStack(stack);
  assert.hasResourceProperties("AWS::Lambda::Function", {
    Handler: "index.handler",
    Runtime: "nodejs18.x",
    Timeout: 900,
    MemorySize: 1024,
  });
  assert.hasResourceProperties("AWS::Events::Rule", {
    ScheduleExpression: "cron(0 0 * * ? *)",
  });
  assert.hasResourceProperties("AWS::IAM::Role", {
    AssumeRolePolicyDocument: {
      Statement: [
        {
          Action: "sts:AssumeRole",
          Effect: "Allow",
          Principal: {
            Service: "lambda.amazonaws.com",
          },
        },
      ],
      Version: "2012-10-17",
    },
  });
  assert.hasResourceProperties("AWS::S3::Bucket", {
    BucketEncryption: {
      ServerSideEncryptionConfiguration: [
        {
          ServerSideEncryptionByDefault: {
            SSEAlgorithm: "AES256",
          },
        },
      ],
    },
  });
});
