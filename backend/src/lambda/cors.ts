import { APIGatewayProxyEvent } from "aws-lambda"
import { getUserId } from './jwt'

/**
 * CORS
 */
 export const CORS_HEADERS = {
  "Access-Control-Allow-Headers" : "Content-Type,Authorization",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS,GET,PUT,PATCH,POST,DELETE",
  "Access-Control-Allow-Credentials": true
}

/**
 * CORS wrapper
 * @param event 
 * @returns JSON response
 */
type Handler = (userId: string, event: APIGatewayProxyEvent) => Promise<object | string>

export const cors = (handler: Handler) => async (event: APIGatewayProxyEvent) => {
  try {
    console.log('Received : ', event.httpMethod, event.resource)
    console.log('Params   : ', event.queryStringParameters)
    console.log('Body     : ', event.body)
    const userId = getUserId(event)
    const response = await handler(userId, event)
    const body = JSON.stringify(response)
    console.log('Response : ', body)
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: body
    }
  } catch (e) {
    console.log(e.stack)
    return {
      statusCode: 502,
      body: JSON.stringify(e)
    }
  }
}
