const mysqlFunctions = require('./mysqlFunctions');
const insertData = async(tableName, data) => {
    const start = "INSERT INTO " + tableName + "(";
    let cols = "";
    let values = "";
    for (const key in data) {
        cols += key + ",";
        if (typeof data[key] === 'string') {
            values += "'" + data[key] + "',";
        } else
            values += data[key] + ",";
    }
    cols = cols.substring(0, cols.length - 1);
    values = values.substring(0, values.length - 1);

    const query = start + cols + ") VALUES (" + values + ");";
    console.log(query);
    await mysqlFunctions.insert(query);

}

// insertData('employeedata', { id: 3, name: 'Suhaib', surname: 'khan', age: 34, username: 'ahmad34', password: '343534' });