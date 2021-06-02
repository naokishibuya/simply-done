import { APIGatewayProxyEvent } from 'aws-lambda'
import { cors } from './cors'
import { TodoItem, updateTodo } from '../businessLogic'

export const handler = cors(async (userId: string, event: APIGatewayProxyEvent) => {
  const todo: TodoItem = JSON.parse(event?.body || '')
  const updated = await updateTodo(userId, todo)
  return updated
})
