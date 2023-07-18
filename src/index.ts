import * as path from "path";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as nodejsLambda from "aws-cdk-lib/aws-lambda-nodejs";
import * as rds from "aws-cdk-lib/aws-rds";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

type DbEngine = 'mysql'

export interface RdsDumpProps {
  readonly dbEngine: DbEngine;
  readonly rdsCluster: rds.DatabaseCluster;
  readonly schedule: events.Schedule;
  readonly databaseName: string;
  readonly idSuffix?: string;
  readonly lambdaNsg?: ec2.ISecurityGroup[];
  readonly lambdaEnv?: {
    [key: string]: string;
  };
  readonly unsecureUserName?: string;
  readonly unsecurePassword?: string;
  readonly secretId?: string;
  readonly createSecretsManagerVPCEndpoint: boolean;
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
      idSuffix,
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
      // TODO 新規作成したEndpointへの接続を許可する
    }

    // DBの内容をバックアップ用にS3にdumpする
    const dumpBucket = new s3.Bucket(scope, `dump-s3-bucket-${idSuffix}`, {
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    const dumpLambda = new nodejsLambda.NodejsFunction(
      scope,
      `dump-lambda-${idSuffix}`,
      {
        bundling: {
          minify: true,
          sourceMap: true,
          target: "es2020",
          externalModules: ["aws-sdk", "nock", "mock-aws-s3"],
          loader: {
            ".node": "file",
          },
        },
        depsLockFilePath: "./yarn.lock",
        runtime: lambda.Runtime.NODEJS_18_X,
        entry: path.join(__dirname, `./lambda/${dbEngine}/index.ts`),
        handler: "handler",
        memorySize: 1024,
        environment: {
          S3_BUCKET: dumpBucket.bucketName,
          RDS_ENDPOINT: rdsCluster.clusterEndpoint.hostname,
          RDS_SECRET_ID: secretId ?? "",
          RDS_USERNAME: unsecureUserName ?? "",
          RDS_PASSWORD: unsecurePassword ?? "",
          DATABASE_NAME: databaseName,
          ...lambdaEnv,
        },
        vpc: rdsCluster.vpc,
        // If the security group for lambda is given, it will be granted.
        // If not given, the CDK will auto-generate it.
        ...(lambdaNsg != null &&
          lambdaNsg.length > 0 && {
            securityGroups: lambdaNsg,
          }),
      },
    );

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
