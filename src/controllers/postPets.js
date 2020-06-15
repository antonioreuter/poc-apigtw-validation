'use strict';

const OpenApiValidator = require("../validator/openapiValidator");

const apiValidator = new OpenApiValidator("src/schema/api.yml");

module.exports.handler = async event => {
  const response = {
    statusCode: 201,
    body: JSON.stringify(
      {
        id: "10",
        name: "Francesca",
        breed: "Vira-lata",
        owner: "Antonio e Natalia",
      },
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
    console.error(err);
    return {      
      statusCode: 500,
      body: JSON.stringify({
        error: err.errors,
      }),
    };
  }
};
