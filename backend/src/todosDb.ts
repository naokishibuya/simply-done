import AWS from 'aws-sdk'
import { assert } from 'console';
import * as uuid from 'uuid'
import { TodoItem } from './businessLogic'

const TABLE_NAME = process.env.TABLE_NAME || '';
const options = process.env.STAGE === 'local' ? {
  endpoint: 'http://dynamodb:8000',
  region: 'local',
  accessKeyId: 'local',
  secretAccessKey: 'local'
} : {}

const docClient = new AWS.DynamoDB.DocumentClient(options)

export const getAllTodos = async (userId: string): Promise<TodoItem[]> => {
  const result = await docClient.query({
    TableName: TABLE_NAME,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    }
  }).promise()
  return result.Items as TodoItem[]
}

export const createTodo = async (userId: string, todo: TodoItem) => {
  const todoId =  uuid.v4()
  const createdAt = new Date().toISOString()
  const newItem = {...todo, userId, todoId, createdAt }
  await docClient.put({
    TableName: TABLE_NAME,
    Item: newItem
  }).promise()
  return newItem as TodoItem
}

export const updateTodo = async (userId: string, todo: TodoItem) => {
  const todoId = todo.todoId
  const updated = await docClient.update({
    TableName: TABLE_NAME,
    Key: { userId, todoId },
    UpdateExpression: "set #n = :name, dueDate=:due, done=:done",
    ExpressionAttributeValues: {
      ":name": todo.name,
      ":due" : todo.dueDate,
      ":done": todo.done
    },
    ExpressionAttributeNames: {
      "#n": "name"
    },
    ReturnValues: "ALL_NEW"
  }).promise()
  return updated.Attributes as TodoItem
}

export const deleteTodo = async (userId: string, todoId: string) => {
  await docClient.delete({
    TableName: TABLE_NAME,
    Key: { userId, todoId }
  }).promise()
}
