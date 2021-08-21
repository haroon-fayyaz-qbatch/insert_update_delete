const process = require('process');

const mysql = require('serverless-mysql')({
    config: {
        host: "localhost",
        port: 3306,
        user: "root",
        password: "",
        database: "employee1", // Add database name here
    }
});

process.on('exit', (code) => {
    mysql.end();
});


module.exports = mysql;