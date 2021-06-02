import * as cdk from '@aws-cdk/core'
import * as lambda from '@aws-cdk/aws-lambda'
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs'
import * as apigateway from '@aws-cdk/aws-apigateway'
import * as dynamodb from '@aws-cdk/aws-dynamodb'

export class BackendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const stage = process.env.STAGE || "local";

    // DynamoDB Table
    const tableName = `TodosTable-${stage}`
    const todosTable = new dynamodb.Table(this, "TodosTable", {
      tableName: tableName,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: "userId", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "todoId", type: dynamodb.AttributeType.STRING }
    })

    // Lambda
    const corsOptions = new NodejsFunction(this, "CorsOptions", {
      runtime: lambda.Runtime.NODEJS_14_X,
      entry: 'src/lambda/corsOptions.ts',
      timeout: cdk.Duration.seconds(60),
      environment: {
        STAGE: stage,
        TABLE_NAME: tableName
      }
    })

    const getTodos = new NodejsFunction(this, "GetTodos", {
      runtime: lambda.Runtime.NODEJS_14_X,
      entry: 'src/lambda/getTodos.ts',
      timeout: cdk.Duration.seconds(60),
      environment: {
        STAGE: stage,
        TABLE_NAME: tableName
      }
    })
    todosTable.grantReadData(getTodos);

    const createTodo = new NodejsFunction(this, "CreateTodo", {
      runtime: lambda.Runtime.NODEJS_14_X,
      entry: 'src/lambda/createTodo.ts',
      timeout: cdk.Duration.seconds(60),
      environment: {
        STAGE: stage,
        TABLE_NAME: tableName
      }
    })
    todosTable.grantReadWriteData(createTodo);

    const updateTodo = new NodejsFunction(this, "UpdateTodo", {
      runtime: lambda.Runtime.NODEJS_14_X,
      entry: 'src/lambda/updateTodo.ts',
      timeout: cdk.Duration.seconds(60),
      environment: {
        STAGE: stage,
        TABLE_NAME: tableName
      }
    })
    todosTable.grantReadWriteData(updateTodo);

    const deleteTodo = new NodejsFunction(this, "DeleteTodo", {
      runtime: lambda.Runtime.NODEJS_14_X,
      entry: 'src/lambda/deleteTodo.ts',
      timeout: cdk.Duration.seconds(60),
      environment: {
        STAGE: stage,
        TABLE_NAME: tableName
      }
    })
    todosTable.grantReadWriteData(deleteTodo);

    // API Gateway
    const todoApi = new apigateway.RestApi(this, "TodoApi", {
      restApiName: "todoApi",
      deployOptions: {
        stageName: stage,
        tracingEnabled: true,
        metricsEnabled: true
      }
    })

    const todos = todoApi.root.addResource("todos")
    todos.addMethod("OPTIONS", new apigateway.LambdaIntegration(corsOptions))
    todos.addMethod("GET", new apigateway.LambdaIntegration(getTodos))
    todos.addMethod("POST", new apigateway.LambdaIntegration(createTodo))
    todos.addMethod("PATCH", new apigateway.LambdaIntegration(updateTodo))

    const todo = todos.addResource('{todoId}')
    todo.addMethod("OPTIONS", new apigateway.LambdaIntegration(corsOptions))
    todo.addMethod("DELETE", new apigateway.LambdaIntegration(deleteTodo))
  }
}
