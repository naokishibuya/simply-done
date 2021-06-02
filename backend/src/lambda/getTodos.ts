import { APIGatewayProxyEvent } from 'aws-lambda'
import { cors } from './cors'
import { getTodos } from '../businessLogic'

export const handler = cors(async (userId: string, event: APIGatewayProxyEvent) => {
  const todos = await getTodos(userId)
  return todos
})
