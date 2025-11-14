/**
 * Doot Backend CDK Stack
 * Defines AWS infrastructure for AppSync API, DynamoDB, Lambda, and auth
 */

import * as cdk from 'aws-cdk-lib';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';
import * as path from 'path';

export class DootBackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ========================================
    // Cognito User Pool for Authentication
    // ========================================
    const userPool = new cognito.UserPool(this, 'DootUserPool', {
      userPoolName: 'doot-users',
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
      },
      autoVerify: {
        email: true,
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
      },
      removalPolicy: cdk.RemovalPolicy.RETAIN, // TODO: Change to DESTROY for dev
    });

    const userPoolClient = userPool.addClient('DootUserPoolClient', {
      authFlows: {
        userPassword: true,
        userSrp: true,
      },
    });

    // ========================================
    // DynamoDB Tables
    // ========================================

    // Users table
    const usersTable = new dynamodb.Table(this, 'UsersTable', {
      tableName: 'doot-users',
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN, // TODO: Change to DESTROY for dev
    });

    // Matches table
    const matchesTable = new dynamodb.Table(this, 'MatchesTable', {
      tableName: 'doot-matches',
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // Messages table
    const messagesTable = new dynamodb.Table(this, 'MessagesTable', {
      tableName: 'doot-messages',
      partitionKey: { name: 'matchId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'sentAt', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // ========================================
    // AppSync GraphQL API
    // ========================================
    const api = new appsync.GraphqlApi(this, 'DootApi', {
      name: 'doot-api',
      schema: appsync.SchemaFile.fromAsset(
        path.join(__dirname, '../../../schema/schema.graphql')
      ),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.USER_POOL,
          userPoolConfig: {
            userPool,
          },
        },
      },
      logConfig: {
        fieldLogLevel: appsync.FieldLogLevel.ALL,
      },
      xrayEnabled: true,
    });

    // ========================================
    // Data Sources
    // ========================================

    // DynamoDB data sources
    const usersDataSource = api.addDynamoDbDataSource(
      'UsersDataSource',
      usersTable
    );

    // TODO: Wire up matches data source to resolvers
    api.addDynamoDbDataSource('MatchesDataSource', matchesTable);

    // TODO: Wire up messages data source to resolvers
    api.addDynamoDbDataSource('MessagesDataSource', messagesTable);

    // ========================================
    // Lambda Functions
    // ========================================

    // Lambda for sendMessage mutation (complex business logic)
    const sendMessageFunction = new lambda.Function(this, 'SendMessageFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'Mutation.sendMessage.handler',
      code: lambda.Code.fromAsset(
        path.join(__dirname, '../appsync/resolvers/lambda')
      ),
      environment: {
        MESSAGES_TABLE: messagesTable.tableName,
        MATCHES_TABLE: matchesTable.tableName,
      },
    });

    messagesTable.grantReadWriteData(sendMessageFunction);
    matchesTable.grantReadWriteData(sendMessageFunction);

    const sendMessageDataSource = api.addLambdaDataSource(
      'SendMessageDataSource',
      sendMessageFunction
    );

    // ========================================
    // Resolvers - VTL (Velocity Template Language)
    // ========================================

    // Query.me - Get current user (VTL)
    usersDataSource.createResolver('QueryMeResolver', {
      typeName: 'Query',
      fieldName: 'me',
      requestMappingTemplate: appsync.MappingTemplate.fromFile(
        path.join(__dirname, '../appsync/resolvers/vtl/Query.me.req.vtl')
      ),
      responseMappingTemplate: appsync.MappingTemplate.fromFile(
        path.join(__dirname, '../appsync/resolvers/vtl/Query.me.res.vtl')
      ),
    });

    // Query.getUser - Get user by ID (VTL)
    usersDataSource.createResolver('QueryGetUserResolver', {
      typeName: 'Query',
      fieldName: 'getUser',
      requestMappingTemplate: appsync.MappingTemplate.fromFile(
        path.join(__dirname, '../appsync/resolvers/vtl/Query.getUser.req.vtl')
      ),
      responseMappingTemplate: appsync.MappingTemplate.fromFile(
        path.join(__dirname, '../appsync/resolvers/vtl/Query.getUser.res.vtl')
      ),
    });

    // ========================================
    // Resolvers - JavaScript Runtime
    // ========================================

    // Mutation.likeUser - Like a user (AppSync JS)
    // TODO: Wire up JS resolver when CDK supports it
    // For now, this would use appsync.Resolver with code property

    // Query.discoverProfiles - Get discovery profiles (AppSync JS)
    // TODO: Wire up JS resolver when CDK supports it

    // ========================================
    // Resolvers - Lambda
    // ========================================

    // Mutation.sendMessage - Send message (Lambda)
    sendMessageDataSource.createResolver('MutationSendMessageResolver', {
      typeName: 'Mutation',
      fieldName: 'sendMessage',
    });

    // ========================================
    // Outputs
    // ========================================
    new cdk.CfnOutput(this, 'GraphQLApiUrl', {
      value: api.graphqlUrl,
      description: 'AppSync GraphQL API URL',
    });

    new cdk.CfnOutput(this, 'GraphQLApiKey', {
      value: api.apiId,
      description: 'AppSync API ID',
    });

    new cdk.CfnOutput(this, 'UserPoolId', {
      value: userPool.userPoolId,
      description: 'Cognito User Pool ID',
    });

    new cdk.CfnOutput(this, 'UserPoolClientId', {
      value: userPoolClient.userPoolClientId,
      description: 'Cognito User Pool Client ID',
    });
  }
}
