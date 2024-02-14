import { readFileSync } from "fs";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { SecretsManager } from "@aws-sdk/client-secrets-manager";
import mysqldump from "mysqldump";

const AWS_REGION = process.env.AWS_REGION;
const s3Client = new S3Client({ region: AWS_REGION });

interface GetSecretReturnType {
  username: string;
  password: string;
}

const dbEngine = process.env.ENGINE ?? "";
const dbEndpoint = process.env.AURORA_ENDPOINT ?? "";
const auroraSecretId = process.env.RDS_SECRET_ID ?? "";
const s3Bucket = process.env.S3_BUCKET ?? "";
const databaseName = process.env.DATABASE_NAME ?? "";

if (s3Bucket === "") {
  throw new Error("S3_BUCKET is not defined.");
}
if (dbEngine === "") {
  throw new Error("ENGINE is not defined.");
}

export const handler = async (_event: any, _context: any): Promise<void> => {
  try {
    console.log("Starting DB dump...");

    const { username, password } = await getDbCredentials();
    const dumpFilePath = "/tmp/dump.sql";

    switch (dbEngine) {
      case "mysql":
        console.log("Dumping MySQL...");
        // Dump MySQL
        // TODO The library itself has already been archived in a public repository.
        // It might be a good idea to consider alternative options...?
        await mysqldump({
          connection: {
            host: dbEndpoint,
            user: username,
            password,
            database: databaseName,
          },
          dumpToFile: dumpFilePath,
        });
        break;
      default:
        throw new Error("Unsupported DB engine.");
    }

    console.log("DB dump completed.");

    const today = new Date();
    const yyyymmddhhmmss = today
      .toISOString()
      .slice(0, 19)
      .replace(/[-:T]/g, "");
    const s3Key = `${yyyymmddhhmmss}.sql`;

    const data = readFileSync("/tmp/dump.sql");

    const params = {
      Bucket: s3Bucket,
      Key: s3Key,
      Body: data,
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    console.log("DB dump uploaded to S3.");
  } catch (error) {
    console.error("An error occurred while dumping DB.", error);
    throw error;
  }
};

const getDbCredentials = async (): Promise<{
  username: string;
  password: string;
}> => {
  let dbUserName = process.env.RDS_USERNAME ?? "";
  let dbPassword = process.env.RDS_PASSWORD ?? "";
  if (auroraSecretId != null) {
    const { username, password } = await getSecret();
    dbUserName = username;
    dbPassword = password;
  }

  return { username: dbUserName, password: dbPassword };
};

const getSecret = async (): Promise<GetSecretReturnType> => {
  const secretsManager = new SecretsManager({
    region: AWS_REGION,
  });
  const response = await secretsManager.getSecretValue({
    SecretId: auroraSecretId,
  });
  const { username, password } = JSON.parse(response.SecretString ?? "");
  if (username == null || password == null) {
    throw new Error("Failed to get secret.");
  }

  return { username, password };
};
