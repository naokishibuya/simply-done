import { APIGatewayProxyEvent } from "aws-lambda"
import { decode } from 'jsonwebtoken'

/**
 * A payload of a JWT token
 */
export interface JwtPayload {
  iss: string
  sub: string
  iat: number
  exp: number
}

/**
 * Get a user id from an API Gateway event
 * @param event an event from API Gateway
 *
 * @returns a user id from a JWT token
 */
export const getUserId = (event: APIGatewayProxyEvent): string => {
  const authorization = event.headers.Authorization
  if (!authorization) {
    return ''
  }
  // Bearer: <jwtToken>
  const jwtToken = authorization.split(' ')[1]
  const decodedJwt = decode(jwtToken) as JwtPayload
  return decodedJwt.sub
}
