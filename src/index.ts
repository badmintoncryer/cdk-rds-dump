import { Duration } from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";
import * as rds from "aws-cdk-lib/aws-rds";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { DumpFunction } from "./lambda/dump-function";

export enum DbEngine {
  MYSQL = "mysql",
}

export interface RdsDumpProps {
  /**
   * Select DB engine type. Currently only mysql can be selected.
   */
  readonly dbEngine: DbEngine;
  /**
   * RDS Cluster to dump.
   */
  readonly rdsCluster: rds.DatabaseCluster;
  /**
   * Schedule to dump. See aws-cdk-lib/aws-events.Schedule.
   * ex.
   * import * as events from 'aws-cdk-lib/aws-events'
   * // It is executed daily at 00:00 UTC.
   * events.Schedule.cron({ minute: "0", hour: "0" })
   */
  readonly schedule: events.Schedule;
  /**
   * Database name to dump.
   */
  readonly databaseName: string;
  /**
   * Suffix to add to the resource ID.
   * @default - no suffix
   */
  readonly idSuffix?: string;
  /**
   * Security group to allow access to the lambda function.
   *
   * @default - use auto generated security group
   */
  readonly lambdaNsg?: ec2.ISecurityGroup[];
  /**
   * Environment variables to set in the lambda function.
   * ex. { "ENV_VAR": "value" }
   *
   * @default - no environment variables
   */
  readonly lambdaEnv?: {
    [key: string]: string;
  };
  /**
   * Database username.
   *
   * We recommend using the secret stored in the Secrets Manager as the connection information to the DB,
   * but it is also possible to specify the user name and password directly.
   * unsecureUserName is a parameter to pass the user name when the `unsecurePassword` is used.
   *
   * @default - do not use unsecureUserName
   */
  readonly unsecureUserName?: string;
  /**
   * Database Password.
   *
   * We recommend using the secret stored in the Secrets Manager as the connection information to the DB,
   * but it is also possible to specify the user name and password directly.
   * unsecurePassword is a parameter to pass the password when the `unsecureUsername` is used.
   *
   * @default - do not use unsecurePassword
   */
  readonly unsecurePassword?: string;
  /**
   * Secret id for database connection information stored in the Secrets Manager.
   *
   * We recommend using the secret stored in the Secrets Manager as the connection information to the DB,
   * but it is also possible to specify the user name and password directly.
   * If secretId is set, the corresponding secret on SecretsManager is retrieved to access the DB.
   *
   * @default - use database cluster's secret
   */
  readonly secretId?: string;
  /**
   * Whether to create an Interface Endpoint for the Secrets Manager.
   *
   * It is recommended to use a secret stored in the Secrets Manager,
   * but in that case, the lambda doing the dump needs a route to access the Secrets Manager.
   * If createSecretsManagerVPCEndpoint is true, an Interface Endpoint is created to allow access to the Secrets Manager.
   *
   * @default false
   */
  readonly createSecretsManagerVPCEndpoint?: boolean;
  /**
   * Whether to create an S3 Gateway Endpoint for the VPC where the RDS is located.
   *
   * @default false
   */
  readonly createS3GatewayEndpoint?: boolean;
  /**
   * List of IDs of security groups to attach to the Interface Endpoint for Secrets Manager.
   * Only used if createSecretsManagerVPCEndpoint is true.
   *
   * @default - use auto generated security group
   */
  readonly secretsManagerVPCEndpointNsgId?: string;

  /**
   * The amount of memory in MB allocated to the Lambda function.
   *
   * @default 10240
   */
  readonly memorySize?: number;
}

/**
 * Construct to dump the contents of an RDS database to S3.
 */
export class RdsDump extends Construct {
  // /**
  //  * Lambda function name to dump the contents of an RDS database to S3.
  //  */
  // public readonly dumpLambdaName: string;

  constructor(
    scope: Construct,
    id: string,
    {
      dbEngine,
      rdsCluster,
      databaseName,
      idSuffix = "default",
      schedule,
      lambdaNsg,
      lambdaEnv,
      unsecureUserName,
      unsecurePassword,
      secretId,
      createSecretsManagerVPCEndpoint,
      createS3GatewayEndpoint,
      secretsManagerVPCEndpointNsgId,
      memorySize,
    }: RdsDumpProps,
  ) {
    super(scope, id);

    if (
      secretId == null &&
      (rdsCluster.secret == null || rdsCluster.secret.secretName == null) &&
      (unsecureUserName == null || unsecurePassword == null)
    ) {
      throw new Error(
        "Either secretId or userName and password must be specified when rdsCluster.secret is not set",
      );
    }

    if (createS3GatewayEndpoint) {
      rdsCluster.vpc.addGatewayEndpoint("S3GatewayEndpoint", {
        service: ec2.GatewayVpcEndpointAwsService.S3,
      });
    }

    if (
      (secretId != null || rdsCluster.secret?.secretName != null) &&
      createSecretsManagerVPCEndpoint
    ) {
      new ec2.InterfaceVpcEndpoint(
        scope,
        `secrets-manager-vpc-endpoint-${idSuffix}`,
        {
          vpc: rdsCluster.vpc,
          service: ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
          ...(secretsManagerVPCEndpointNsgId != null && {
            securityGroups: [
              ec2.SecurityGroup.fromSecurityGroupId(
                scope,
                `secrets-manager-interface-endpoint-sg-${idSuffix}`,
                secretsManagerVPCEndpointNsgId,
              ),
            ],
          }),
        },
      );
    }

    // DBの内容をバックアップ用にS3にdumpする
    const dumpBucket = new s3.Bucket(scope, `dump-s3-bucket-${idSuffix}`, {
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    const dumpLambda = new DumpFunction(scope, `dump-lambda-${idSuffix}`, {
      memorySize: memorySize ?? 10240,
      timeout: Duration.minutes(15),
      environment: {
        S3_BUCKET: dumpBucket.bucketName,
        RDS_ENDPOINT: rdsCluster.clusterEndpoint.hostname,
        RDS_SECRET_ID: secretId ?? rdsCluster.secret?.secretName ?? "",
        RDS_USERNAME: unsecureUserName ?? "",
        RDS_PASSWORD: unsecurePassword ?? "",
        DATABASE_NAME: databaseName,
        ENGINE: dbEngine,
        ...lambdaEnv,
      },
      vpc: rdsCluster.vpc,
      // If the security group for lambda is given, it will be granted.
      // If not given, the CDK will auto-generate it.
      ...(lambdaNsg != null &&
        lambdaNsg.length > 0 && {
          securityGroups: lambdaNsg,
        }),
    });
    // this.dumpLambdaName = dumpLambda.functionName;

    rdsCluster.secret?.grantRead(dumpLambda);
    dumpBucket.grantWrite(dumpLambda);
    // Allow connections to the DB for the automatically generated Security Group
    if (lambdaNsg == null || lambdaNsg.length === 0) {
      rdsCluster.connections.allowFrom(dumpLambda, ec2.Port.tcp(3306));
    }

    // Set the execution timing of the batch process
    new events.Rule(scope, `lambda-execution-rule-dump-${idSuffix}`, {
      schedule,
      targets: [
        new targets.LambdaFunction(dumpLambda, {
          retryAttempts: 2,
        }),
      ],
    });
  }
}
