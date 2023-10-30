var mysql = require('mysql');
var connection = mysql.createConnection({
	host:'sql12.freesqldatabase.com',
	user:'sql12657596',
	password:'3lQ3YCXyX8',
	database:'sql12657596'
});
connection.connect(function(error){
	if(!!error) {
		console.log(error);
	} else {
		console.log('Database Connected Successfully..!!');
	}
});

module.exports = connection;