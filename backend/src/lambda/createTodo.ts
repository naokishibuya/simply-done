import { APIGatewayProxyEvent } from 'aws-lambda'
import { cors } from './cors'
import { TodoItem, createTodo } from '../businessLogic'

export const handler = cors(async (userId: string, event: APIGatewayProxyEvent) => {
  const todo: TodoItem = JSON.parse(event?.body || '')
  const added = await createTodo(userId, todo)
  return added
})
