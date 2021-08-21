const mysqlFunctions = require('./mysqlFunctions');
const _ = require('lodash');
const mysql = require('./connection');
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

const buildQuery = async(options) => {
    let queryWithCols = '';
    for (const key in options.where) {
        if (logicalOperators.includes(key)) {
            for (const cols in options.where[key]) {
                let count = 0;
                if (Object.keys(options.where[key][cols]).length)
                    queryWithCols += " (";
                for (const operations in options.where[key][cols]) {
                    const index = _.findIndex(comparisonOperators, (operators) => operators.op === operations.toLowerCase());
                    if (index != -1) {
                        if (typeof options.where[key][cols][operations] === 'string')
                            queryWithCols += " " + cols + comparisonOperators[index].symbol + "'" + options.where[key][cols][operations] + "' " + "AND";
                        else
                            queryWithCols += " " + cols + comparisonOperators[index].symbol + options.where[key][cols][operations] + " " + "AND";
                    } else
                        console.log("Invalid operator used")
                }

                queryWithCols = queryWithCols.substring(0, queryWithCols.lastIndexOf(" "));
                if (Object.keys(options.where[key][cols]).length)
                    queryWithCols += ") ";
                queryWithCols += " " + key
            }
        } else {
            console.log('Invalid operator ', key, ', failed to process this query');
            return;
        }
        queryWithCols = queryWithCols.substring(0, queryWithCols.lastIndexOf(" "));
        return queryWithCols;

    }
}

const deleteData = async(tableName, options) => {
    const start = 'DELETE FROM ' + tableName + ' WHERE ';
    const query = start + await buildQuery(options);
    console.log(query);
    mysqlFunctions.delete(start + await buildQuery(options));
}

const updateData = async(tableName, data, options) => {
    const start = 'UPDATE ' + tableName + ' SET ';
    const where = " WHERE " + await buildQuery(options);
    let updateData = '';
    for (const key in data) {
        updateData += " " + key + '=';
        if (typeof data[key] === 'string') {
            updateData += "'" + data[key] + "' ,";
        } else
            updateData += data[key] + " ,";
    }
    updateData = updateData.substring(0, updateData.lastIndexOf(" "));
    const query = start + updateData + where;
    console.log(query);
    mysqlFunctions.update(query);
}


insertData('employeedata', { id: 3, name: 'Saleem', surname: 'khan', age: 35, username: 'saleem34', password: '34334' });

updateData('employeedata', { name: 'Shafeeq', surname: 'Ahmad' }, {
    where: {
        or: {
            id: {
                eq: 2,
            },
        }
    }
});


deleteData('employeedata', {
    where: {
        or: {
            id: {
                eq: 2,
            },
        }
    }
});