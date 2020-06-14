const apiSchemaBuilder = require("api-schema-builder");
const SchemaEndpointResolver = require("./schemaEndpointResolver");
const RequestValidationError = require("./requestValidationError");
const ResponseValidationError = require("./responseValidationError");
const _ = require("underscore")._;

const cloneHttpHeaders = (headers) => {
  if (headers && Object.keys(headers).length > 0) {    
    return Object.keys(headers).reduce((acc, key) => {
      acc[key.toLowerCase()] = headers[key];
      return acc;
    }, {});
  }

  return {};
}

module.exports = class OpenApiValidator {
  constructor(apiSchemaPath, errorOptions = {}) {
    const schemaOptions = {
      buildRequest: true,
      buildResponse: true,
      formats: [
        { name: "double", pattern: /\d+\.(\d+)+/ },
        { name: "int64", pattern: /^\d{1,19}$/ },
        { name: "int32", pattern: /^\d{1,10}$/ },
      ],
    };
    this.schemas = apiSchemaBuilder.buildSchemaSync(
      apiSchemaPath,
      schemaOptions
    );
    this.errorOptions = errorOptions;
    this.schemaEndpointResolver = new SchemaEndpointResolver();
  }

  validateRequest(request) {
    const httpHeaders = cloneHttpHeaders(request.headers);
    const path = request.path;
    const httpMethod = request.requestContext.httpMethod.toLowerCase();
    const contentType = httpHeaders["content-type"] || "application/json";
    const targetSchema =
      this.schemaEndpointResolver.getMethodSchema(
        this.schemas,
        path,
        httpMethod
      ) || {};
    const errors = [];   

    if (targetSchema.parameters) {
      const isParametersValid = targetSchema.parameters.validate({
        query: request.queryStringParameters || {},
        headers: httpHeaders,
        path: request.pathParameters || {},
        files: undefined,
      });

      if (!isParametersValid) {
        errors.push(targetSchema.parameters.errors);
      }
    }

    if (targetSchema.body && request.body) {
      const bodyValidator = targetSchema.body[contentType] || targetSchema.body;
      if (!bodyValidator.validate(JSON.parse(request.body))) {
        errors.push(bodyValidator.errors);
      }
    }

    if (errors.length > 0) throw new RequestValidationError(_.flatten(errors), this.errorOptions);

    return true;
  }

  validateResponse(request, response) {
    const httpHeaders = cloneHttpHeaders(response.headers);
    const path = request.path;
    const httpMethod = request.requestContext.httpMethod.toLowerCase();
    const targetSchema =
      this.schemaEndpointResolver.getMethodSchema(
        this.schemas,
        path,
        httpMethod
      ).responses[response.statusCode] || {};

    if (!targetSchema.validate({
      body: JSON.parse(response.body),
      headers: httpHeaders
    })) {
      throw new ResponseValidationError(targetSchema.errors, this.errorOptions);
    }
  }
};
