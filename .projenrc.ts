import { awscdk } from "projen";
import { ReleaseTrigger } from "projen/lib/release";
const project = new awscdk.AwsCdkConstructLibrary({
  author: "Kazuho CryerShinozuka",
  authorAddress: "malaysia.cryer@gmail.com",
  cdkVersion: "2.87.0",
  defaultReleaseBranch: "main",
  jsiiVersion: "~5.0.0",
  name: "cdk-rds-dump",
  projenrcTs: true,
  prettier: true,
  repositoryUrl: "https://github.com/badmintoncryer/cdk-rds-dump.git",
  description: "CDK Construct Library by Typescript for RDS Dump",
  keywords: ["aws", "cdk", "lambda", "aws-cdk"],
  python: {
    distName: "cdk-rds-dump",
    module: "cdk_rds_dump",
  },
  // dotnet: {
  //   dotNetNamespace: 'CdkRdsDump',
  //   packageId: 'CdkRdsDump',
  // },
  // publishToMaven: {
  //   javaPackage: 'com.github.malaysia-cryer.cdk-rds-dump',
  //   mavenGroupId: 'com.github.malaysia-cryer',
  //   mavenArtifactId: 'cdk-rds-dump',
  // },
  majorVersion: 1,
  releaseTrigger: ReleaseTrigger.continuous(),
  bundledDeps: [
    "mysqldump",
    "@aws-sdk/client-s3",
    "@aws-sdk/client-secrets-manager",
  ],

  // deps: ["mysqldump", "@aws-sdk/client-s3", "@aws-sdk/client-secrets-manager"],
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});
project.synth();
