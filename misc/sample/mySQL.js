import mysql from "mysql"
const mysqlConfig = {
    host    : 'pocauroradb.cluster-ctdy54v3otyc.eu-west-1.rds.amazonaws.com',
    user    : 'adminGET',
    password: 'Admin123',
    database: 'POCDB1',
    multipleStatements:true,
    connectionLimit : 50
  };

const pool = mysql.createPool(mysqlConfig);

class MySQLUtils {
  static async excuteStoredProcedure(sql,values) {
    const resultData = () => {
      return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
          if (err) {
            lg.error(err);
          }
          connection.query(sql,values ,(error, elements) => {
            if (error) {
              return reject(error);
            }
            connection.release();
            return resolve(elements);
          });
        });
      });
    };
    try {
      const resul = await resultData();
      return resul;
    } catch (ex) {
      console.log(ex);
    }
  }
}
export { MySQLUtils };
