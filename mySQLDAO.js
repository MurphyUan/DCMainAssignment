var mysql = require('promise-mysql')
var pool

mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'collegedb'
})
    .then((result) => {
        pool = result
    })
    .catch((err) => {
        console.log(err)
    })

var getQuery = (query) => {
    return new Promise((resolve, reject) => {
        pool.query(query)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

module.exports = { getQuery }