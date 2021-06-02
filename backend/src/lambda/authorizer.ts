import { APIGatewayAuthorizerEvent, APIGatewayAuthorizerResult } from 'aws-lambda'
import { verifyUserId } from './jwt'

const authorizationResponse = (userId: string, effect: string) => {
  return {
    principalId: userId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [{
        Action: 'execute-api:Invoke',
        Effect: 'Allow',
        Resource: '*'
      }]
    }
  }
}

export const handler = async (event: APIGatewayAuthorizerEvent) => {  
  try {
    if (event.type !== 'TOKEN') {
      throw Error('Authorization type is not TOKEN!')
    }
    console.log('Authorizing a user', event.authorizationToken)
    const userId = await verifyUserId(event.authorizationToken)
    return authorizationResponse(userId, 'Allow')
  } catch (e) {
    console.error('User not authorized', { error: e.message })
    return authorizationResponse('Unknown user', 'Deny')
  }
}
