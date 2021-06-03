import { APIGatewayProxyEvent } from 'aws-lambda'
import { cors } from './cors'
import { getUploadUrl } from '../businessLogic'

export const handler = cors(async (userId: string, event: APIGatewayProxyEvent) => {
  const todoId = event.pathParameters?.todoId || ''
  const { signedUrl, attachmentUrl } = await getUploadUrl(userId, todoId)
  return { signedUrl, attachmentUrl }
})
