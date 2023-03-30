require('dotenv').config()

const mysql = require('mysql');
const connection = mysql.createConnection({
	host     : process.env.HOST,
	user     : process.env.USER,
	password : process.env.PASSWORD,
	database : process.env.DB,
	port : '3306'
});

module.exports = connection;