import { Duration } from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";
import * as rds from "aws-cdk-lib/aws-rds";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { DumpFunction } from "./lambda/dump-function";

type DbEngine = "mysql" | "postgresql";

export interface RdsDumpProps {
  /**
   * Select DB engine type. Currently mysql and postgresql can be selected.
   *
   * @type {DbEngine}
   * @memberof RdsDumpProps
   */
  readonly dbEngine: DbEngine;
  /**
   * RDS Cluster to dump.
   *
   * @type {rds.DatabaseCluster}
   * @memberof RdsDumpProps
   */
  readonly rdsCluster: rds.DatabaseCluster;
  /**
   * Schedule to dump. See aws-cdk-lib/aws-events.Schedule.
   * ex.
   * import * as events from 'aws-cdk-lib/aws-events'
   * // It is executed daily at 00:00 UTC.
   * events.Schedule.cron({ minute: "0", hour: "0" })
   *
   * @type {events.Schedule}
   * @memberof RdsDumpProps
   */
  readonly schedule: events.Schedule;
  /**
   * Database name to dump.
   *
   * @type {string}
   * @memberof RdsDumpProps
   */
  readonly databaseName: string;
  /**
   * Suffix to add to the resource ID.
   *
   * @type {string}
   * @memberof RdsDumpProps
   */
  readonly idSuffix?: string;
  /**
   * Security group to allow access to the lambda function.
   *
   * @type {ec2.ISecurityGroup[]}
   * @memberof RdsDumpProps
   */
  readonly lambdaNsg?: ec2.ISecurityGroup[];
  /**
   * Environment variables to set in the lambda function.
   * ex. { "ENV_VAR": "value" }
   *
   * @type {{
   *     [key: string]: string;
   *   }}
   * @memberof RdsDumpProps
   */
  readonly lambdaEnv?: {
    [key: string]: string;
  };
  /**
   * Database username.
   *
   * We recommend using the secret stored in the Secrets Manager as the connection information to the DB,
   * but it is also possible to specify the user name and password directly.
   * unsecureUserName is a parameter to pass the user name when the latter is used.
   *
   * @type {string}
   * @memberof RdsDumpProps
   */
  readonly unsecureUserName?: string;
  /**
   * Database Password.
   *
   * We recommend using the secret stored in the Secrets Manager as the connection information to the DB,
   * but it is also possible to specify the user name and password directly.
   * unsecurePassword is a parameter to pass the password when the latter is used.
   *
   * @type {string}
   * @memberof RdsDumpProps
   */
  readonly unsecurePassword?: string;
  /**
   * Database connection information stored in the Secrets Manager.
   *
   * We recommend using the secret stored in the Secrets Manager as the connection information to the DB,
   * but it is also possible to specify the user name and password directly.
   * If secretId is set, the corresponding secret on SecretsManager is retrieved to access the DB.
   *
   * @type {string}
   * @memberof RdsDumpProps
   */
  readonly secretId?: string;
  /**
   * It is recommended to use a secret stored in the Secrets Manager,
   * but in that case, the lambda doing the dump needs a route to access the Secrets Manager.
   * If createSecretsManagerVPCEndpoint is true, an Interface Endpoint is created to allow access to the Secrets Manager.
   *
   * @type {boolean}
   * @memberof RdsDumpProps
   */
  readonly createSecretsManagerVPCEndpoint: boolean;
  /**
   * List of IDs of security groups to attach to the Interface Endpoint for Secrets Manager.
   * Only used if createSecretsManagerVPCEndpoint is true.
   *
   * @type {string}
   * @memberof RdsDumpProps
   */
  readonly secretsManagerVPCEndpointNsgId?: string;
}

export class RdsDump extends Construct {
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
      secretsManagerVPCEndpointNsgId,
    }: RdsDumpProps,
  ) {
    super(scope, id);

    if (
      secretId == null &&
      (unsecureUserName == null || unsecurePassword == null)
    ) {
      throw new Error(
        "Either secretId or userName and password must be specified.",
      );
    }

    // secretIdが指定されている場合は、そのsecretを利用する
    // その際に必要なsecrets manager vpc endpointを作成する
    if (secretId != null && createSecretsManagerVPCEndpoint) {
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
      memorySize: 1024,
      timeout: Duration.minutes(15),
      environment: {
        S3_BUCKET: dumpBucket.bucketName,
        RDS_ENDPOINT: rdsCluster.clusterEndpoint.hostname,
        RDS_SECRET_ID: secretId ?? "",
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

    rdsCluster.secret?.grantRead(dumpLambda);
    dumpBucket.grantWrite(dumpLambda);
    // NSGを自動生成する場合、DBへの接続を許可する
    if (lambdaNsg == null || lambdaNsg.length === 0) {
      rdsCluster.connections.allowFrom(dumpLambda, ec2.Port.tcp(3306));
    }

    // バッチ処理の実行タイミングを設定する
    new events.Rule(scope, `lambda-execution-rule-dump-${idSuffix}`, {
      schedule,
      targets: [
        new targets.LambdaFunction(dumpLambda, {
          retryAttempts: 1,
        }),
      ],
    });
  }
}
