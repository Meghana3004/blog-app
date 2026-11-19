import { MySQLUtils } from './db.js';

export const handler = async (event, context) => {
  console.log(event);

  const sqlToGet = 'CALL FetchUserData(?)';
  console.log('SQL to execute (Fetch User Data) - ' + sqlToGet);

  try {
    const username = event.pathParameters.username;
    const response = await MySQLUtils.excuteStoredProcedure(sqlToGet, [username]);

    if (response.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'User not found' }),
      };
    }

    const userData = response[0];
    return {
      statusCode: 200,
      body: JSON.stringify(userData),
    };
  } catch (exp) {
    console.error(exp);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};

