#!/usr/bin/env node
/**
 * CDK App Entry Point
 * Defines the CDK application and instantiates stacks
 */

import * as cdk from 'aws-cdk-lib';
import { DootBackendStack } from './stack';

const app = new cdk.App();

// Create the main backend stack
new DootBackendStack(app, 'DootBackendStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
  },
  description: 'Doot dating app backend infrastructure with AppSync',
});

app.synth();
