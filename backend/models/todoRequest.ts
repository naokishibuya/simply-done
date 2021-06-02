import { JsonSchemaType, JsonSchemaVersion } from '@aws-cdk/aws-apigateway'

export default {
  schema: JsonSchemaVersion.DRAFT4,
  title: "todoRequest",
  type: JsonSchemaType.OBJECT,
  properties: {
      name: {
        type: JsonSchemaType.STRING,
        minLength: 1
      },
      dueDate: {
        type: JsonSchemaType.STRING
      }
  },
  required: [
      "name",
      "dueDate"
  ],
  additionalProperties: true
}
