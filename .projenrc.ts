import { awscdk } from 'projen';
const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: '2.45.0',
  defaultReleaseBranch: 'main',
  name: 's3-playground',
  projenrcTs: true,

  deps: [
    '@aws-sdk/credential-providers',
    '@aws-sdk/client-s3',
  ],
});
project.synth();