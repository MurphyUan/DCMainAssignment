const { MongoClient } = require('mongodb')

const url = 'mongodb://localhost:27017'
const dbName = 'lecturersDB'
const colName = 'lecturers'

var lecturersDB
var lecturers

MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
    .then((client)=>{
        lecturersDB = client.db(dbName)
        lecturers = lecturersDB.collection(colName)
    })
    .catch((error)=>{
        console.log(error)
    })

var find = (document) =>{
    return new Promise((resolve, reject) => {
        var cursor = lecturers.find(document).sort([['_id',1]])
        cursor.toArray()
            .then((documents) =>{
                resolve(documents)
            })
            .catch((error)=>{
                reject(error)
            })
    })
}

var insertInto = (document) => {
    return new Promise((resolve, reject) => {
        lecturers.insertOne(document)
            .then((documents) => {
                resolve(documents)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

module.exports = { find , insertInto }