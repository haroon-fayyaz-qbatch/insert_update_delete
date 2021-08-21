const mysql = require('./connection');
module.exports = {
    insert: async(query) => {
        mysql.query(query).then(async(result) => {
            console.log('Your data is inserted with id:', result.insertId);
        }).catch(error => console.error(error));
    },
    delete: async(query) => {
        mysql.query(query).then(async(result) => {
            console.log(result);
            // console.log('Your data is inserted with id:', result.insertId);
        }).catch(error => console.error(error));
    }
}