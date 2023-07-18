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
});
