'use strict';

const { uuid } = require('uuidv4');
const dbClientFactory = require("../util/dbClientFactory");
const OpenApiValidator = require("../validator/openapiValidator");

const apiValidator = new OpenApiValidator("src/schema/api.yml");

const dbClient = dbClientFactory.createDBClientFactory();

module.exports.handler = async event => {
  console.log("-------EVENT--------");
  console.log(`${JSON.stringify(event)}`);
  console.log("---------------");

  const pet = JSON.parse(event.body);
  pet.id = uuid();

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: pet
  }
  console.log(params);

  const response = {
    statusCode: 201,
    body: JSON.stringify(
      pet,
      null,
      2
    ),
  };

  try {
    const request = event;
    console.log("Validating request...");
    apiValidator.validateRequest(request);
    console.log("Creating new pet...");
    await dbClient.put(params).promise();
    console.log("Validating response...");
    apiValidator.validateResponse(request, response);

    return response;
  } catch (err) {
    console.error(err);
    return {      
      statusCode: 500,
      body: JSON.stringify({
        error: err.errors,
      }),
    };
  }
};
