// ~~ Generated by projen. To modify, edit .projenrc.ts and run "npx projen".
import * as path from 'path';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

/**
 * Props for DumpFunction
 */
export interface DumpFunctionProps extends lambda.FunctionOptions {
}

/**
 * An AWS Lambda function which executes src/lambda/dump.
 */
export class DumpFunction extends lambda.Function {
  constructor(scope: Construct, id: string, props?: DumpFunctionProps) {
    super(scope, id, {
      description: 'src/lambda/dump.lambda.ts',
      ...props,
      runtime: new lambda.Runtime('nodejs16.x', lambda.RuntimeFamily.NODEJS),
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../assets/lambda/dump.lambda')),
    });
    this.addEnvironment('AWS_NODEJS_CONNECTION_REUSE_ENABLED', '1', { removeInEdge: true });
  }
}