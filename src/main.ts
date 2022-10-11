import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
import { join } from 'path';

export class MyStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    const bucket = new Bucket(this, 'Bucket', {
      bucketName: 'marcio-s3-playground',
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    new BucketDeployment(this, 'BucketDeployment', {
      destinationBucket: bucket,
      sources: [
        Source.asset(join(__dirname, 'files')),
      ],
    });

    const lambda = new NodejsFunction(this, 'Function', {
      entry: join(__dirname, 'lambda-fns/index.ts'),
      handler: 'handler',
      runtime: Runtime.NODEJS_16_X,
      environment: {
        BUCKET_NAME: bucket.bucketName,
      }
    });
    bucket.grantRead(lambda);
  }
}

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new MyStack(app, 's3-playground-dev', { env: devEnv });
// new MyStack(app, 's3-playground-prod', { env: prodEnv });

app.synth();