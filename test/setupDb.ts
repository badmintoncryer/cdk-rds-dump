import { RDSClient, ExecuteStatementCommand } from "@aws-sdk/client-rds";
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

const secretsManagerClient = new SecretsManagerClient({});
const rdsDataClient = new RDSClient({});

export const handler = async (_event: any) => {
  const secretValueCommand = new GetSecretValueCommand({
    SecretId: process.env.CLUSTER_SECRET_ARN!,
  });
  const secretValueResponse =
    await secretsManagerClient.send(secretValueCommand);
  const secret = JSON.parse(secretValueResponse.SecretString!);

  const executeStatementCommand = new ExecuteStatementCommand({
    sql: "CREATE DATABASE IF NOT EXISTS testDatabase; CREATE TABLE IF NOT EXISTS testDatabase.testTable (id INT AUTO_INCREMENT, name VARCHAR(255) NOT NULL, PRIMARY KEY (id));",
    database: "testDatabase",
    secretArn: process.env.CLUSTER_SECRET_ARN,
    resourceArn: secret.dbClusterArn,
  });

  await rdsDataClient.send(executeStatementCommand);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Database and table created successfully!",
    }),
  };
};
