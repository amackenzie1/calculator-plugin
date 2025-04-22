import { Stack, StackProps, RemovalPolicy, CfnOutput, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';

export class CalculatorStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create DynamoDB table
    const calculatorDataTable = new dynamodb.Table(this, 'CalculatorDataTable', {
      tableName: 'CalculatorUserData',
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, // On-demand capacity
      removalPolicy: RemovalPolicy.RETAIN, // Keep the table when the stack is deleted
    });

    // Add a GSI for timestamp
    calculatorDataTable.addGlobalSecondaryIndex({
      indexName: 'timestamp-index',
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'timestamp',
        type: dynamodb.AttributeType.NUMBER,
      },
    });

    // Create API Gateway to expose DynamoDB operations
    const api = new apigateway.RestApi(this, 'CalculatorDataAPI', {
      description: 'API for calculator data logging',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: [
          'Content-Type',
          'X-Amz-Date',
          'Authorization',
          'X-Api-Key',
          'X-Amz-Security-Token'
        ],
        allowCredentials: true,
      },
    });

    // Create Lambda function to handle writes to DynamoDB
    const loggerFunction = new lambda.Function(this, 'LoggerFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(__dirname + '/../lambda'),
      timeout: Duration.seconds(30), // Increase timeout to 30 seconds
      memorySize: 512, // Increase memory to 512 MB
      environment: {
        TABLE_NAME: calculatorDataTable.tableName
      }
    });

    // Grant the Lambda function write access to the DynamoDB table
    calculatorDataTable.grantWriteData(loggerFunction);

    // Add the Lambda function as the backend for the API endpoint
    const logEndpoint = api.root.addResource('log');
    logEndpoint.addMethod('POST', new apigateway.LambdaIntegration(loggerFunction));

    // Create outputs to easily access the resources
    new CfnOutput(this, 'DynamoDBTableName', {
      value: calculatorDataTable.tableName,
      description: 'The name of the DynamoDB table',
    });

    new CfnOutput(this, 'DynamoDBTableARN', {
      value: calculatorDataTable.tableArn,
      description: 'The ARN of the DynamoDB table',
    });

    new CfnOutput(this, 'ApiEndpoint', {
      value: api.url,
      description: 'The endpoint URL of the API Gateway',
    });
  }
}