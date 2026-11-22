const awsServerlessExpress = require('aws-serverless-express');
const app = require('./server');

const server = awsServerlessExpress.createServer(app);

exports.handler = async (event, context) => {
  // Prevent Lambda from waiting for database connections to close
  context.callbackWaitsForEmptyEventLoop = false;
  return awsServerlessExpress.proxy(server, event, context);
};