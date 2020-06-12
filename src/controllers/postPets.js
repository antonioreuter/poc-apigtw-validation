'use strict';

const OpenApiValidator = require("../validator/openapiValidator");

const apiValidator = new OpenApiValidator("src/schema/api.yml");

module.exports.handler = async event => {
  const successResponse = {
    statusCode: 200,
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
    apiValidator.validateResponse(request, successResponse);

    return successResponse;
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: err.errors,
      }),
    };
  }
};
