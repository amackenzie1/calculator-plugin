"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculatorStack = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const dynamodb = require("aws-cdk-lib/aws-dynamodb");
const apigateway = require("aws-cdk-lib/aws-apigateway");
const lambda = require("aws-cdk-lib/aws-lambda");
class CalculatorStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // Create DynamoDB table
        const calculatorDataTable = new dynamodb.Table(this, 'CalculatorDataTable', {
            tableName: 'CalculatorUserData',
            partitionKey: {
                name: 'id',
                type: dynamodb.AttributeType.STRING,
            },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, // On-demand capacity
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.RETAIN, // Keep the table when the stack is deleted
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
            code: lambda.Code.fromAsset('lambda'),
            timeout: aws_cdk_lib_1.Duration.seconds(30), // Increase timeout to 30 seconds
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
        new aws_cdk_lib_1.CfnOutput(this, 'DynamoDBTableName', {
            value: calculatorDataTable.tableName,
            description: 'The name of the DynamoDB table',
        });
        new aws_cdk_lib_1.CfnOutput(this, 'DynamoDBTableARN', {
            value: calculatorDataTable.tableArn,
            description: 'The ARN of the DynamoDB table',
        });
        new aws_cdk_lib_1.CfnOutput(this, 'ApiEndpoint', {
            value: api.url,
            description: 'The endpoint URL of the API Gateway',
        });
    }
}
exports.CalculatorStack = CalculatorStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsY3VsYXRvci1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2NhbGN1bGF0b3Itc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkNBQW9GO0FBRXBGLHFEQUFxRDtBQUVyRCx5REFBeUQ7QUFDekQsaURBQWlEO0FBRWpELE1BQWEsZUFBZ0IsU0FBUSxtQkFBSztJQUN4QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQWtCO1FBQzFELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLHdCQUF3QjtRQUN4QixNQUFNLG1CQUFtQixHQUFHLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUscUJBQXFCLEVBQUU7WUFDMUUsU0FBUyxFQUFFLG9CQUFvQjtZQUMvQixZQUFZLEVBQUU7Z0JBQ1osSUFBSSxFQUFFLElBQUk7Z0JBQ1YsSUFBSSxFQUFFLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTTthQUNwQztZQUNELFdBQVcsRUFBRSxRQUFRLENBQUMsV0FBVyxDQUFDLGVBQWUsRUFBRSxxQkFBcUI7WUFDeEUsYUFBYSxFQUFFLDJCQUFhLENBQUMsTUFBTSxFQUFFLDJDQUEyQztTQUNqRixDQUFDLENBQUM7UUFFSCwwQkFBMEI7UUFDMUIsbUJBQW1CLENBQUMsdUJBQXVCLENBQUM7WUFDMUMsU0FBUyxFQUFFLGlCQUFpQjtZQUM1QixZQUFZLEVBQUU7Z0JBQ1osSUFBSSxFQUFFLElBQUk7Z0JBQ1YsSUFBSSxFQUFFLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTTthQUNwQztZQUNELE9BQU8sRUFBRTtnQkFDUCxJQUFJLEVBQUUsV0FBVztnQkFDakIsSUFBSSxFQUFFLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTTthQUNwQztTQUNGLENBQUMsQ0FBQztRQUVILG1EQUFtRDtRQUNuRCxNQUFNLEdBQUcsR0FBRyxJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLG1CQUFtQixFQUFFO1lBQzVELFdBQVcsRUFBRSxpQ0FBaUM7WUFDOUMsMkJBQTJCLEVBQUU7Z0JBQzNCLFlBQVksRUFBRSxVQUFVLENBQUMsSUFBSSxDQUFDLFdBQVc7Z0JBQ3pDLFlBQVksRUFBRSxVQUFVLENBQUMsSUFBSSxDQUFDLFdBQVc7Z0JBQ3pDLFlBQVksRUFBRTtvQkFDWixjQUFjO29CQUNkLFlBQVk7b0JBQ1osZUFBZTtvQkFDZixXQUFXO29CQUNYLHNCQUFzQjtpQkFDdkI7Z0JBQ0QsZ0JBQWdCLEVBQUUsSUFBSTthQUN2QjtTQUNGLENBQUMsQ0FBQztRQUVILHNEQUFzRDtRQUN0RCxNQUFNLGNBQWMsR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLGdCQUFnQixFQUFFO1lBQ2pFLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVc7WUFDbkMsT0FBTyxFQUFFLGVBQWU7WUFDeEIsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQztZQUNyQyxPQUFPLEVBQUUsc0JBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUUsaUNBQWlDO1lBQ2hFLFVBQVUsRUFBRSxHQUFHLEVBQUUsNEJBQTRCO1lBQzdDLFdBQVcsRUFBRTtnQkFDWCxVQUFVLEVBQUUsbUJBQW1CLENBQUMsU0FBUzthQUMxQztTQUNGLENBQUMsQ0FBQztRQUVILCtEQUErRDtRQUMvRCxtQkFBbUIsQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFbkQsOERBQThEO1FBQzlELE1BQU0sV0FBVyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2hELFdBQVcsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLElBQUksVUFBVSxDQUFDLGlCQUFpQixDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7UUFFaEYsZ0RBQWdEO1FBQ2hELElBQUksdUJBQVMsQ0FBQyxJQUFJLEVBQUUsbUJBQW1CLEVBQUU7WUFDdkMsS0FBSyxFQUFFLG1CQUFtQixDQUFDLFNBQVM7WUFDcEMsV0FBVyxFQUFFLGdDQUFnQztTQUM5QyxDQUFDLENBQUM7UUFFSCxJQUFJLHVCQUFTLENBQUMsSUFBSSxFQUFFLGtCQUFrQixFQUFFO1lBQ3RDLEtBQUssRUFBRSxtQkFBbUIsQ0FBQyxRQUFRO1lBQ25DLFdBQVcsRUFBRSwrQkFBK0I7U0FDN0MsQ0FBQyxDQUFDO1FBRUgsSUFBSSx1QkFBUyxDQUFDLElBQUksRUFBRSxhQUFhLEVBQUU7WUFDakMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxHQUFHO1lBQ2QsV0FBVyxFQUFFLHFDQUFxQztTQUNuRCxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFoRkQsMENBZ0ZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU3RhY2ssIFN0YWNrUHJvcHMsIFJlbW92YWxQb2xpY3ksIENmbk91dHB1dCwgRHVyYXRpb24gfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIGR5bmFtb2RiIGZyb20gJ2F3cy1jZGstbGliL2F3cy1keW5hbW9kYic7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBhcGlnYXRld2F5IGZyb20gJ2F3cy1jZGstbGliL2F3cy1hcGlnYXRld2F5JztcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtbGFtYmRhJztcblxuZXhwb3J0IGNsYXNzIENhbGN1bGF0b3JTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBTdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICAvLyBDcmVhdGUgRHluYW1vREIgdGFibGVcbiAgICBjb25zdCBjYWxjdWxhdG9yRGF0YVRhYmxlID0gbmV3IGR5bmFtb2RiLlRhYmxlKHRoaXMsICdDYWxjdWxhdG9yRGF0YVRhYmxlJywge1xuICAgICAgdGFibGVOYW1lOiAnQ2FsY3VsYXRvclVzZXJEYXRhJyxcbiAgICAgIHBhcnRpdGlvbktleToge1xuICAgICAgICBuYW1lOiAnaWQnLFxuICAgICAgICB0eXBlOiBkeW5hbW9kYi5BdHRyaWJ1dGVUeXBlLlNUUklORyxcbiAgICAgIH0sXG4gICAgICBiaWxsaW5nTW9kZTogZHluYW1vZGIuQmlsbGluZ01vZGUuUEFZX1BFUl9SRVFVRVNULCAvLyBPbi1kZW1hbmQgY2FwYWNpdHlcbiAgICAgIHJlbW92YWxQb2xpY3k6IFJlbW92YWxQb2xpY3kuUkVUQUlOLCAvLyBLZWVwIHRoZSB0YWJsZSB3aGVuIHRoZSBzdGFjayBpcyBkZWxldGVkXG4gICAgfSk7XG5cbiAgICAvLyBBZGQgYSBHU0kgZm9yIHRpbWVzdGFtcFxuICAgIGNhbGN1bGF0b3JEYXRhVGFibGUuYWRkR2xvYmFsU2Vjb25kYXJ5SW5kZXgoe1xuICAgICAgaW5kZXhOYW1lOiAndGltZXN0YW1wLWluZGV4JyxcbiAgICAgIHBhcnRpdGlvbktleToge1xuICAgICAgICBuYW1lOiAnaWQnLFxuICAgICAgICB0eXBlOiBkeW5hbW9kYi5BdHRyaWJ1dGVUeXBlLlNUUklORyxcbiAgICAgIH0sXG4gICAgICBzb3J0S2V5OiB7XG4gICAgICAgIG5hbWU6ICd0aW1lc3RhbXAnLFxuICAgICAgICB0eXBlOiBkeW5hbW9kYi5BdHRyaWJ1dGVUeXBlLk5VTUJFUixcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBDcmVhdGUgQVBJIEdhdGV3YXkgdG8gZXhwb3NlIER5bmFtb0RCIG9wZXJhdGlvbnNcbiAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ2F0ZXdheS5SZXN0QXBpKHRoaXMsICdDYWxjdWxhdG9yRGF0YUFQSScsIHtcbiAgICAgIGRlc2NyaXB0aW9uOiAnQVBJIGZvciBjYWxjdWxhdG9yIGRhdGEgbG9nZ2luZycsXG4gICAgICBkZWZhdWx0Q29yc1ByZWZsaWdodE9wdGlvbnM6IHtcbiAgICAgICAgYWxsb3dPcmlnaW5zOiBhcGlnYXRld2F5LkNvcnMuQUxMX09SSUdJTlMsXG4gICAgICAgIGFsbG93TWV0aG9kczogYXBpZ2F0ZXdheS5Db3JzLkFMTF9NRVRIT0RTLFxuICAgICAgICBhbGxvd0hlYWRlcnM6IFtcbiAgICAgICAgICAnQ29udGVudC1UeXBlJyxcbiAgICAgICAgICAnWC1BbXotRGF0ZScsXG4gICAgICAgICAgJ0F1dGhvcml6YXRpb24nLFxuICAgICAgICAgICdYLUFwaS1LZXknLFxuICAgICAgICAgICdYLUFtei1TZWN1cml0eS1Ub2tlbidcbiAgICAgICAgXSxcbiAgICAgICAgYWxsb3dDcmVkZW50aWFsczogdHJ1ZSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBDcmVhdGUgTGFtYmRhIGZ1bmN0aW9uIHRvIGhhbmRsZSB3cml0ZXMgdG8gRHluYW1vREJcbiAgICBjb25zdCBsb2dnZXJGdW5jdGlvbiA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgJ0xvZ2dlckZ1bmN0aW9uJywge1xuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE4X1gsXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQoJ2xhbWJkYScpLFxuICAgICAgdGltZW91dDogRHVyYXRpb24uc2Vjb25kcygzMCksIC8vIEluY3JlYXNlIHRpbWVvdXQgdG8gMzAgc2Vjb25kc1xuICAgICAgbWVtb3J5U2l6ZTogNTEyLCAvLyBJbmNyZWFzZSBtZW1vcnkgdG8gNTEyIE1CXG4gICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICBUQUJMRV9OQU1FOiBjYWxjdWxhdG9yRGF0YVRhYmxlLnRhYmxlTmFtZVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gR3JhbnQgdGhlIExhbWJkYSBmdW5jdGlvbiB3cml0ZSBhY2Nlc3MgdG8gdGhlIER5bmFtb0RCIHRhYmxlXG4gICAgY2FsY3VsYXRvckRhdGFUYWJsZS5ncmFudFdyaXRlRGF0YShsb2dnZXJGdW5jdGlvbik7XG5cbiAgICAvLyBBZGQgdGhlIExhbWJkYSBmdW5jdGlvbiBhcyB0aGUgYmFja2VuZCBmb3IgdGhlIEFQSSBlbmRwb2ludFxuICAgIGNvbnN0IGxvZ0VuZHBvaW50ID0gYXBpLnJvb3QuYWRkUmVzb3VyY2UoJ2xvZycpO1xuICAgIGxvZ0VuZHBvaW50LmFkZE1ldGhvZCgnUE9TVCcsIG5ldyBhcGlnYXRld2F5LkxhbWJkYUludGVncmF0aW9uKGxvZ2dlckZ1bmN0aW9uKSk7XG5cbiAgICAvLyBDcmVhdGUgb3V0cHV0cyB0byBlYXNpbHkgYWNjZXNzIHRoZSByZXNvdXJjZXNcbiAgICBuZXcgQ2ZuT3V0cHV0KHRoaXMsICdEeW5hbW9EQlRhYmxlTmFtZScsIHtcbiAgICAgIHZhbHVlOiBjYWxjdWxhdG9yRGF0YVRhYmxlLnRhYmxlTmFtZSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIG5hbWUgb2YgdGhlIER5bmFtb0RCIHRhYmxlJyxcbiAgICB9KTtcblxuICAgIG5ldyBDZm5PdXRwdXQodGhpcywgJ0R5bmFtb0RCVGFibGVBUk4nLCB7XG4gICAgICB2YWx1ZTogY2FsY3VsYXRvckRhdGFUYWJsZS50YWJsZUFybixcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIEFSTiBvZiB0aGUgRHluYW1vREIgdGFibGUnLFxuICAgIH0pO1xuXG4gICAgbmV3IENmbk91dHB1dCh0aGlzLCAnQXBpRW5kcG9pbnQnLCB7XG4gICAgICB2YWx1ZTogYXBpLnVybCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIGVuZHBvaW50IFVSTCBvZiB0aGUgQVBJIEdhdGV3YXknLFxuICAgIH0pO1xuICB9XG59Il19