"use strict";

const SchemaValidationError = require("./schemaValidationError");


/**
 * Represent a request validation error
 * errors field will include the `ajv` error
 * @class RequestValidationError
 * @extends {Error}
 */
module.exports = class RequestValidationError extends SchemaValidationError {
  constructor(errors, options = {}) {
    super("Input validation error", errors, options);
  }
};