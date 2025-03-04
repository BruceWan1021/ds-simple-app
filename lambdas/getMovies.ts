import { Handler } from "aws-lambda";

import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
// Initialization
const ddbDocClient = createDDbDocClient();
// Handler
export const handler: Handler = async () => {
  try {
    console.log("Fetching all movies");
    
    
    const commandOutput = await ddbDocClient.send(
      new ScanCommand({
        TableName: process.env.TABLE_NAME!,
      })
    );
    console.log('ScanCommand response: ', commandOutput)
    
    // Return Response
    return {
      statusCode: 200,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({data: commandOutput.Items || []}),
    };
  } catch (error: any) {
    console.log(JSON.stringify(error));
    return {
      statusCode: 500,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ error }),
    };
  }
};

function createDDbDocClient() {
  const ddbClient = new DynamoDBClient({ region: process.env.REGION });

  return DynamoDBDocumentClient.from(ddbClient);
}

