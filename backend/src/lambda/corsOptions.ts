import { APIGatewayProxyEvent } from 'aws-lambda'
import { CORS_HEADERS } from './cors'

export const handler = async (event: APIGatewayProxyEvent) => {
  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: JSON.stringify('CORS OK!')
  }
}
