import {MySQLUtils} from './mySQL'
export const get=async (event,context)=>{
    console.log(event)
    const sqlToGet = 'CALL  ' + 'pricingtooldev' + '.`GET-ZONES`()';
    lg.info('SQL to execute (GET Zone Detail) By payload - ' + sqlToGet);
    try {
      const response = await MySQLUtils.excuteStoredProcedure(sqlToGet);
      if (response) {
        lg.info(JSON.stringify(response));
        return {
            'status':200,
            'body':response[0]
        };
      }
    } catch (exp) {
      lg.info(exp);
      return {
        'status':500,
        'body':"Internal Server Error"
    }
    }
}