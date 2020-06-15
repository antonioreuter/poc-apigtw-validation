'use strict';

const OpenApiValidator = require('../validator/openapiValidator');

const apiValidator = new OpenApiValidator("src/schema/api.yml", { 
  beautifyErrors: true,
});

module.exports.handler = async event => {
  const response = {
    statusCode: 200,
    body: JSON.stringify(
      {
        id: "10",
        name: "Francesca",
        breed: "vira-lata",
        owner: "Antonio e Natalia"
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
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: err.errors,
      }),
    };
  }
};
