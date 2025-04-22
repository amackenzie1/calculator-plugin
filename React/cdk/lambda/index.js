const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    console.log('Received event:', JSON.stringify(event));
    
    let body;
    try {
      body = JSON.parse(event.body);
    } catch (e) {
      console.error('Error parsing request body:', e);
      console.log('Raw body:', event.body);
      throw new Error('Invalid request body format');
    }
    
    console.log('Parsed body:', JSON.stringify(body));
    
    if (!body.id || !body.timestamp) {
      throw new Error('Missing required fields: id and timestamp are required');
    }
    
    const params = {
      TableName: process.env.TABLE_NAME,
      Item: {
        id: body.id,
        timestamp: body.timestamp,
        data: body.data
      }
    };
    
    console.log('Writing to DynamoDB with params:', JSON.stringify(params));
    await dynamo.put(params).promise();
    console.log('Write successful');
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};