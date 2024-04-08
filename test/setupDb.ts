import { SecretsManager } from "@aws-sdk/client-secrets-manager";
import { createConnection } from "mysql2/promise";

interface GetSecretReturnType {
  username: string;
  password: string;
}

const AWS_REGION = process.env.AWS_REGION;
const dbEndpoint = process.env.RDS_ENDPOINT ?? "";
const rdsSecretId = process.env.RDS_SECRET_ID ?? "";

if (dbEndpoint == null || dbEndpoint === "") {
  throw new Error("RDS_ENDPOINT is not defined.");
}
if (rdsSecretId == null || rdsSecretId === "") {
  throw new Error("RDS_SECRET_ID is not defined.");
}

export const handler = async (_event: any) => {
  const { username, password } = await getSecret();

  const connection = await createConnection({
    host: dbEndpoint,
    user: username,
    password: password,
  });

  try {
    await connection.execute("CREATE DATABASE IF NOT EXISTS testDatabase;");
    await connection.changeUser({ database: "testDatabase" });
    await connection.execute(
      `CREATE TABLE IF NOT EXISTS testDatabase.testTable (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
    );
  } catch (error) {
    throw new Error(`Failed to create database and table: ${error}`);
  } finally {
    await connection.end();
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Database and table created successfully!",
    }),
  };
};

const getSecret = async (): Promise<GetSecretReturnType> => {
  const secretsManager = new SecretsManager({
    region: AWS_REGION,
  });
  const response = await secretsManager.getSecretValue({
    SecretId: rdsSecretId,
  });
  const { username, password } = JSON.parse(response.SecretString ?? "");
  if (username == null || password == null) {
    throw new Error("Failed to get secret.");
  }

  return { username, password };
};
