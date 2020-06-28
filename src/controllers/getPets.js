'use strict';

const dbClientFactory = require("../util/dbClientFactory");
const OpenApiValidator = require('../validator/openapiValidator');

const apiValidator = new OpenApiValidator("src/schema/api.yml", {
  beautifyErrors: true,
});

const dbClient = dbClientFactory.createDBClientFactory();

module.exports.handler = async event => {

  const params = {
    KeyConditionExpression: `id = :id`,
    TableName: process.env.DYNAMODB_TABLE,
    ExpressionAttributeValues: {
      ':id': event.pathParameters.id
    }
  };

  const dbResult = await dbClient.query(params).promise();
  const pet = dbResult.Items[0];

  const response = {
    statusCode: 200,
    body: JSON.stringify(pet,
      null,
      2
    ),
  };

  try {
    const request = event;
    apiValidator.validateRequest(request);
    apiValidator.validateResponse(request, response);

    return response;
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: err.errors,
      }),
    };
  }
};
