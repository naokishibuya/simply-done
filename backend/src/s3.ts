import * as AWS from 'aws-sdk'

const IMAGES_S3_BUCKET = process.env.IMAGES_S3_BUCKET
const SIGNED_URL_EXPIRATION = process.env.SIGNED_URL_EXPIRATION || ''

const s3 = new AWS.S3({signatureVersion: 'v4'})

export const generateUploadUrl = async (userId: string, todoId: string) => {
  const key = `${userId}/${todoId}`
  const attachmentUrl = 'https://' + IMAGES_S3_BUCKET + '.s3.amazonaws.com/' + key
  const signedUrl = s3.getSignedUrl('putObject', {
      Bucket: IMAGES_S3_BUCKET,
      Key: key,
      Expires: parseInt(SIGNED_URL_EXPIRATION)
  })

  console.log("Generated Presigned URL: ", signedUrl)
  return { attachmentUrl, signedUrl }
}
