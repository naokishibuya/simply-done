import * as cdk from '@aws-cdk/core'
import * as iam from '@aws-cdk/aws-iam'
import * as lambda from '@aws-cdk/aws-lambda'
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs'
import * as apigateway from '@aws-cdk/aws-apigateway'
import * as dynamodb from '@aws-cdk/aws-dynamodb'
import * as s3 from '@aws-cdk/aws-s3'
import todoRequest from '../models/todoRequest'

export class BackendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const stage = process.env.STAGE || 'local';

    // DynamoDB Table
    const tableName = `TodosTable-${stage}`
    const todosTable = new dynamodb.Table(this, 'TodosTable', {
      tableName: tableName,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'todoId', type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY // TODO while testing
    })

    // S3
    const imagesS3Bucket = `todos-029013197347-${stage}`
    const signedUrlExpiration = '300'

    const s3Bucket = new s3.Bucket(this, 'S3Bucket', {
      versioned: false,
      bucketName: imagesS3Bucket,
      publicReadAccess: false,
      //blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // TODO while testing
      cors: [
        {
          allowedHeaders: ['*'],
          allowedMethods: [
            s3.HttpMethods.GET,
            s3.HttpMethods.PUT,
            s3.HttpMethods.POST,
            s3.HttpMethods.DELETE,
            s3.HttpMethods.HEAD
          ],
          allowedOrigins: ['*'],
          maxAge: 3000
        }
      ]
    })

    const s3BucketPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['s3:GetObject'],
      principals: [new iam.CanonicalUserPrincipal('*')],
      resources: [s3Bucket.bucketArn + '/*'],
    })
    s3Bucket.addToResourcePolicy(s3BucketPolicy)

    // Lambda
    const authorizer = new NodejsFunction(this, 'Autherizer', {
      runtime: lambda.Runtime.NODEJS_14_X,
      entry: 'src/lambda/authorizer.ts',
      timeout: cdk.Duration.seconds(60),
      environment: {
        STAGE: stage
      }
    })

    const corsOptions = new NodejsFunction(this, 'CorsOptions', {
      runtime: lambda.Runtime.NODEJS_14_X,
      entry: 'src/lambda/corsOptions.ts',
      timeout: cdk.Duration.seconds(60),
      environment: {
        STAGE: stage,
        TABLE_NAME: tableName
      }
    })

    const getTodos = new NodejsFunction(this, 'GetTodos', {
      runtime: lambda.Runtime.NODEJS_14_X,
      entry: 'src/lambda/getTodos.ts',
      timeout: cdk.Duration.seconds(60),
      environment: {
        STAGE: stage,
        TABLE_NAME: tableName
      }
    })
    todosTable.grantReadData(getTodos)

    const createTodo = new NodejsFunction(this, 'CreateTodo', {
      runtime: lambda.Runtime.NODEJS_14_X,
      entry: 'src/lambda/createTodo.ts',
      timeout: cdk.Duration.seconds(60),
      environment: {
        STAGE: stage,
        TABLE_NAME: tableName
      }
    })
    todosTable.grantReadWriteData(createTodo)

    const updateTodo = new NodejsFunction(this, 'UpdateTodo', {
      runtime: lambda.Runtime.NODEJS_14_X,
      entry: 'src/lambda/updateTodo.ts',
      timeout: cdk.Duration.seconds(60),
      environment: {
        STAGE: stage,
        TABLE_NAME: tableName
      }
    })
    todosTable.grantReadWriteData(updateTodo);

    const deleteTodo = new NodejsFunction(this, 'DeleteTodo', {
      runtime: lambda.Runtime.NODEJS_14_X,
      entry: 'src/lambda/deleteTodo.ts',
      timeout: cdk.Duration.seconds(60),
      environment: {
        STAGE: stage,
        TABLE_NAME: tableName
      }
    })
    todosTable.grantReadWriteData(deleteTodo)

    const getUploadUrl = new NodejsFunction(this, 'GetUploadUrl', {
      runtime: lambda.Runtime.NODEJS_14_X,
      entry: 'src/lambda/getUploadUrl.ts',
      timeout: cdk.Duration.seconds(60),
      environment: {
        STAGE: stage,
        TABLE_NAME: tableName,
        IMAGES_S3_BUCKET: imagesS3Bucket,
        SIGNED_URL_EXPIRATION: signedUrlExpiration
      }
    })
    todosTable.grantReadWriteData(getUploadUrl)
    s3Bucket.grantReadWrite(getUploadUrl)

    // API Gateway
    const todoApi = new apigateway.RestApi(this, 'TodoApi', {
      restApiName: 'todoApi',
      deployOptions: {
        stageName: stage,
        tracingEnabled: true,
        metricsEnabled: true
      }
    })

    // Authorizer allows API gateway to invoke it
    const requestAuthorizer = new apigateway.TokenAuthorizer(this, 'Authorizer', {
      handler: authorizer
    })

    // Request validator
    const requestValidator = todoApi.addRequestValidator('TodoRequestValidator', {
      requestValidatorName: 'todo-request-validator',
      validateRequestBody: true
    })

    const requestModel = todoApi.addModel('TodoRequestModel', {
      contentType: 'application/json',
      schema: todoRequest
    })

    todoApi.addGatewayResponse('TodoGatewayResponse', {
      type: apigateway.ResponseType.DEFAULT_4XX,
      responseHeaders: {
        'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
        'gatewayresponse.header.Access-Control-Allow-Headers':
          "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
        'gatewayresponse.header.Access-Control-Allow-Methods': "'*'",
      }
    })

    const todos = todoApi.root.addResource('todos')
    todos.addMethod('OPTIONS', new apigateway.LambdaIntegration(corsOptions))
    todos.addMethod('GET', new apigateway.LambdaIntegration(getTodos), {
      authorizer: requestAuthorizer
    })
    todos.addMethod('POST', new apigateway.LambdaIntegration(createTodo), {
      authorizer: requestAuthorizer,
      requestValidator: requestValidator,
      requestModels: { 'application/json': requestModel }
    })
    todos.addMethod('PATCH', new apigateway.LambdaIntegration(updateTodo), {
      authorizer: requestAuthorizer,
      requestValidator: requestValidator,
      requestModels: { 'application/json': requestModel }
    })

    const todo = todos.addResource('{todoId}')
    todo.addMethod('OPTIONS', new apigateway.LambdaIntegration(corsOptions))
    todo.addMethod('DELETE', new apigateway.LambdaIntegration(deleteTodo), {
      authorizer: requestAuthorizer
    })

    const attachmentUrl = todo.addResource('attachment')
    attachmentUrl.addMethod('OPTIONS', new apigateway.LambdaIntegration(corsOptions))
    attachmentUrl.addMethod('POST', new apigateway.LambdaIntegration(getUploadUrl), {
      authorizer: requestAuthorizer
    })
  }
}
