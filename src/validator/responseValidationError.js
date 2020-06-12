"use strict";

const SchemaValidationError = require('./schemaValidationError');

/**
 * Represent a response validation error
 * @class ResponseValidationError
 * @extends {Error}
 */
module.exports = class ResponseValidationError extends SchemaValidationError {
  constructor(errors, options) {
    super("Invalid response error", errors, options);
  }
}