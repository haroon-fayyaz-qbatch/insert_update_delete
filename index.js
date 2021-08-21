const mysqlFunctions = require('./mysqlFunctions');
const _ = require('lodash');
const logicalOperators = ['or', 'and'];
const comparisonOperators = [{
    op: 'gt',
    symbol: '>'
}, {
    op: 'gte',
    symbol: '>='
}, {
    op: 'lt',
    symbol: '<'
}, {
    op: 'lte',
    symbol: '<='
}, {
    op: 'eq',
    symbol: '='
}, {
    op: 'noteq',
    symbol: '!='
}, ];


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

const deleteData = async(tableName, options) => {
    const start = 'DELETE FROM ' + tableName + ' WHERE ';
    let queryWithCols = '';
    for (const key in options.where) {
        if (logicalOperators.includes(key)) {
            for (const cols in options.where[key]) {
                for (const operations in options.where[key][cols]) {
                    const index = _.findIndex(comparisonOperators, (operators) => operators.op === operations.toLowerCase());
                    if (index != -1) {
                        if (typeof options.where[key][cols][operations] === 'string')
                            queryWithCols += cols + comparisonOperators[index].symbol + "'" + options.where[key][cols][operations] + "' " + key + " ";
                        else
                            queryWithCols += cols + comparisonOperators[index].symbol + options.where[key][cols][operations] + " " + key + " ";
                    } else
                        console.log("Invalid operator used")
                }
            }
        } else {
            console.log('Invalid operator ', key, ', failed to process this query');
            return;
        }

        console.log(queryWithCols.substring(0, queryWithCols.lastIndexOf(" ")));
    }
}

// insertData('employeedata', { id: 3, name: 'Suhaib', surname: 'khan', age: 34, username: 'ahmad34', password: '343534' });

deleteData('employeedata', {
    where: {
        or: {
            id: {
                eq: 3,
            },
            name: {
                eq: 'Ahmad'
            }
        }
    }
});