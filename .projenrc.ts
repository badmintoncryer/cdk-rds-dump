import { awscdk } from "projen";
import { ReleaseTrigger } from "projen/lib/release";
const project = new awscdk.AwsCdkConstructLibrary({
  author: "Kazuho CryerShinozuka",
  authorAddress: "malaysia.cryer@gmail.com",
  cdkVersion: "2.125.0",
  defaultReleaseBranch: "main",
  jsiiVersion: "~5.3.0",
  name: "cdk-rds-dump",
  projenrcTs: true,
  prettier: true,
  repositoryUrl: "https://github.com/badmintoncryer/cdk-rds-dump.git",
  description: "CDK Construct Library by Typescript for RDS Dump",
  keywords: ["aws", "cdk", "lambda", "aws-cdk", "rds"],
  gitignore: ["*.js", "*.d.ts", "!test/.*.snapshot/**/*", ".tmp"],
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
  majorVersion: 2,
  releaseTrigger: ReleaseTrigger.continuous(),
  bundledDeps: [
    "mysqldump",
    "@aws-sdk/client-s3",
    "@aws-sdk/client-secrets-manager",
    "@aws-sdk/client-rds",
  ],
  devDeps: [
    "@aws-cdk/integ-runner@2.135.0-alpha.0",
    "@aws-cdk/integ-tests-alpha@2.135.0-alpha.0",
  ],

  // deps: ["mysqldump", "@aws-sdk/client-s3", "@aws-sdk/client-secrets-manager"],
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});
project.projectBuild.testTask.exec(
  "yarn tsc -p tsconfig.dev.json && yarn integ-runner",
);
project.synth();
