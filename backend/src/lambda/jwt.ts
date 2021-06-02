import { APIGatewayProxyEvent } from "aws-lambda"
import { JwtHeader, decode, verify } from 'jsonwebtoken'
import { JwksClient, CertSigningKey } from 'jwks-rsa'

/**
 * Extract token from authentication header
 * @param authHeader
 * @returns authorization token
 */
const getToken = (authHeader?: string): string => {
  if (!authHeader)
    throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  // Bearer: <jwtToken>
  const split = authHeader.split(' ')
  const token = split[1]
  return token
}

interface JwtPayload {
  iss: string
  sub: string
  iat: number
  exp: number
}

interface JwtComplete {
  header: JwtHeader
  payload: JwtPayload
}

/**
 * Get a user id from an API Gateway event
 * @param event an event from API Gateway
 *
 * @returns a user id from a JWT token
 */
export const getUserId = (event: APIGatewayProxyEvent): string => {
  const authHeader = event.headers.Authorization
  const token = getToken(authHeader)
  const decoded = decode(token) as JwtPayload
  return decoded.sub
}

// URL that can be used to download a certificate to verify JWT token signature.
// Go to an Auth0 application page > Advanced Settings > Endpoints > JSON Web Key Set
const jwksUri = 'https://dev-rvz7mepr.us.auth0.com/.well-known/jwks.json'

/**
 * Token verification
 * https://auth0.com/blog/navigating-rs256-and-jwks/
 * @param authHeader 
 * @returns 
 */
export const verifyUserId = async (authHeader: string) => {
  const token = getToken(authHeader)
  const { header, payload } = decode(token, { complete: true }) as JwtComplete
  const client = new JwksClient({ jwksUri: jwksUri })
  if (!header.kid)
    throw new Error("Authorization kid is missing!")
  const key = await client.getSigningKey(header.kid) as CertSigningKey
  const jwt = verify(token, key.publicKey, { algorithms: ['RS256'] }) as JwtPayload
  console.log('User was authorized', jwt)
  return jwt.sub || ''
}
