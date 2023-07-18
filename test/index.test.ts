import { Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { Vpc } from "aws-cdk-lib/aws-ec2";
import { Schedule } from "aws-cdk-lib/aws-events";
import { DatabaseCluster } from "aws-cdk-lib/aws-rds";
import * as rds from "aws-cdk-lib/aws-rds";
import { RdsDump, RdsDumpProps } from "../src";

test("RdsDump construct creates resources", () => {
  const stack = new Stack();

  // Your DatabaseCluster
  const rdsCluster = new DatabaseCluster(stack, "DatabaseClusterId", {
    engine: rds.DatabaseClusterEngine.auroraMysql({
      version: rds.AuroraMysqlEngineVersion.VER_2_07_2,
    }),
    instanceProps: {
      vpc: new Vpc(stack, "VpcId"),
    },
  });

  const rdsDumpProps: RdsDumpProps = {
    dbEngine: "mysql",
    rdsCluster: rdsCluster,
    schedule: Schedule.cron({ minute: "0", hour: "0" }),
    databaseName: "testDB",
    secretId: "testSecretId",
    createSecretsManagerVPCEndpoint: false,
  };

  new RdsDump(stack, "RdsDumpId", rdsDumpProps);

  // Check if the necessary resources have been created in the stack
  const assert = Template.fromStack(stack);
  assert.hasResourceProperties("AWS::Lambda::Function", {
    Handler: "index.handler",
    Runtime: "nodejs16.x",
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
