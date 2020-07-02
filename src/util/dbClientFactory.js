'use strict';

const AWS = require('aws-sdk');

let dbConf = {};

if (process.env.STAGE == "dev") {
    dbConf = {
        region: "us-east-1",
        endpoint: "http://localhost:4566"
    }
};

const dbOptions = {
    region: "us-east-1",
    maxRetries: 3,
    retryDelayOptions: { base: 300 }
};

const config = Object.assign(dbOptions, dbConf);


const createDBClientFactory = () => new AWS.DynamoDB.DocumentClient(config);

module.exports = {
    createDBClientFactory
};
