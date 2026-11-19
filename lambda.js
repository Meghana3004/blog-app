const awsServerlessExpress = require('aws-serverless-express');
const app = require('./server');
const db = require('./db');

const server = awsServerlessExpress.createServer(app);

exports.handler = async (event, context) => {
  // Prevent Lambda from waiting for database connections to close
  context.callbackWaitsForEmptyEventLoop = false;

  // Get database connection
  const connection = db.getConnection();

  try {
    // Handle the request
    const response = await awsServerlessExpress.proxy(server, event, context);
    return response;
  } finally {
    // Close the database connection
    if (connection) {
      connection.end();
    }
  }
};