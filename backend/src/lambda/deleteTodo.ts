import { APIGatewayProxyEvent } from 'aws-lambda'
import { cors } from './cors'
import { deleteTodo } from '../businessLogic'

export const handler = cors(async (userId: string, event: APIGatewayProxyEvent) => {
  const todoId = event.pathParameters?.todoId || ''
  await deleteTodo(userId, todoId)
  return todoId
})
