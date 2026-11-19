const mysql = require('mysql');

const config = {
  host: 'pocauroradb.cluster-ctdy54v3otyc.eu-west-1.rds.amazonaws.com',
  user: 'adminGET',
  password: 'Admin123',
  database: 'POCDB1',
  multipleStatements: true 
};

const connection = mysql.createConnection(config);

// const executeStoredProcedure = (procedureName, args, callback) => {
//   const query = `CALL ${procedureName}(${args.map(() => '?').join(',')})`;
//   connection.query(query, args, callback);
// };

const executeStoredProcedure = (procedureName, args = [], callback) => {
  // Ensure args is an array
  args = Array.isArray(args) ? args : [];

  // Generate the query string with placeholders for arguments
  const placeholders = args.map(() => '?').join(',');
  const query = `CALL ${procedureName}(${placeholders})`;

  // Execute the stored procedure
  connection.query(query, args, callback);
};


connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

module.exports = {
  connection,
  executeStoredProcedure,
};