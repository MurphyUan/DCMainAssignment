//import packages
const { MongoClient } = require('mongodb')

// global variables
const url = 'mongodb://localhost:27017'
const dbName = 'lecturersDB'
const colName = 'lecturers'
var lecturersDB
var lecturers

//MongoDB Connection Promise
MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
    //Connection succeeds
    .then((client)=>{
        //Get the database
        lecturersDB = client.db(dbName)
        //Get the collection
        lecturers = lecturersDB.collection(colName)
    })
    //Connection fails
    .catch((error)=>{
        //Log Error
        console.log(error)
    })
//Generic Find Query with Sort that accepts two arguments
var find = (document, sort) =>{
    // Returns Promise of type resolve or reject
    return new Promise((resolve, reject) => {
        // MongoDB Find Query
        var cursor = lecturers.find(document)
            //Sort the Query
            .sort(
                //Remove First Character of Sort String
                [[sort.substring(1),
                //Get First Character of Sort String and Check Sign + / -
                Math.sign(parseInt(sort.charAt(0)+"1"))]]
                )
        //convert result to array
        cursor.toArray()
            //Conversion succeeds
            .then((documents) =>{
                //throw documents to then()
                resolve(documents)
            })
            //Conversion fails
            .catch((error)=>{
                //throw result to catch()
                reject(error)
            })
    })
}
//Generic Insert Query that accepts one argument
var insertInto = (document) => {
    // Returns Promise of type resolve or reject
    return new Promise((resolve, reject) => {
        // MongoDB Insert Query
        lecturers.insertOne(document)
            // Insert succeeds
            .then((documents) => {
                // throw documents to then()
                resolve(documents)
            })
            // Insert fails
            .catch((error) => {
                // throw error to catch()
                reject(error)
            })
    })
}

// Generic Distinct Query that accepts one argument
var distinct = (document) =>{
    // Returns Promise of type resolve or reject
    return new Promise((resolve, reject) =>{
        // MongoDB Distinct Search Query
        lecturers.distinct(document)
            // Search succeeds
            .then((documents) => {
                // throw documents to then()
                resolve(documents)
            })
            // Search fails
            .catch((error) => {
                // throw error to catch()
                reject(error)
            })
    })
}

//export functions to application
module.exports = { find , insertInto , distinct }