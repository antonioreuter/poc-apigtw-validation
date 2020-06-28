'use strict';

const AWS = require('aws-sdk');

let dbConf = {};

if (process.env.STAGE == "dev") {
    dbConf = {
        region: "localhost",
        endpoint: "http://localhost:8000"
    }
};

const dbOptions = {
    region: process.env.AWS_DEFAULT_REGION || "eu-central-1",
    maxRetries: 3,
    retryDelayOptions: { base: 300 }
};

const config = Object.assign(dbOptions, dbConf);


const createDBClientFactory = () => new AWS.DynamoDB.DocumentClient(config);

module.exports = {
    createDBClientFactory
};
