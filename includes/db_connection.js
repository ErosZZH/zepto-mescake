var dbName = 'mescake';
var password = 'pass';
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password:password,
  database:dbName
});
function handleError (err) {
  if (err) {
    // ��������ӶϿ����Զ���������
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      connection = mysql.createConnection({
		  host     : 'localhost',
		  user     : 'root',
		  password:password,
		  database:dbName
		});
	   connection.on('error', handleError);
    } else {
      console.error(err.stack || err);
    }
  }
}
connection.on('error', handleError);
var Mysql = {
	connect:function(){
		return connection.connect();
	},
	close:function(){
		return connection.close();
	},
	query:function(sql,callback,error){
		//var _c = Mysql.connect();
		connection.query(sql, function(err, rows, fields) {
		  if (err) {
			  throw err;
		  }
		  callback(rows,fields);
		});
	},
	
	//m.getOne('ecs_users',{user_id:2},function(d){
	//console.log(d);
	//});
	getOne:function(table,condition,callback,orderby){
	  
	  var sql = 'SELECT * FROM {TABLE} WHERE {CONDITION} LIMIT 0,1';
	  var con = [];
	  for(var c in condition){
		  con.push(c+'='+condition[c]);
	  }
	  con = con.join(' AND ');
	  sql = sql.replace('{TABLE}',table);
	  sql = sql.replace('{CONDITION}',con);
	  if(orderby){
		sql+=orderby;
	  }

	  this.query(sql,function(rows,fields){
		callback(rows[0]);
	  });
	},

	getAll:function(table,condition,callback,order){
	  var sql = 'SELECT * FROM {TABLE} WHERE {CONDITION}';
	  var con = [];
	  var order = order||'';
	  for(var c in condition){
		  con.push(c+'='+condition[c]);
	  }
	  con = con.join(' AND ');
	  sql = sql.replace('{TABLE}',table);
	  sql = sql.replace('{CONDITION}',con);
	  if(order){
		sql+=order;
	  }
	  
	  this.query(sql,function(rows,fields){
		callback(rows);
	  });
	}

}
exports.Mysql = Mysql;
