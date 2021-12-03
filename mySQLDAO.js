// import packages
var mysql = require('promise-mysql')
// global variable
var pool

// MYSQL connection promise
mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'collegedb'
})
    // connection succeeds
    .then((result) => {
        pool = result
    })
    // connection fails
    .catch((err) => {
        console.log(err)
    })

// Generic Query Function, accepts one parameter
var getQuery = (query) => {
    // Returns Promise of type resolve and reject
    return new Promise((resolve, reject) => {
        // Query the sql server
        pool.query(query)
            // Query succeeds
            .then((result) => {
                //throw result to then()
                resolve(result) 
            })
            //Query Fails
            .catch((error) => {
                // throw error to catch()
                reject(error) 
            })
    })
}
//export function to application
module.exports = { getQuery }