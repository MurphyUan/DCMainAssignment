// Package Importing
var express = require('express')
var bodyParser = require('body-parser')
var { check, validationResult } = require('express-validator')
var ejs = require('ejs')

// File Importing
var mySQLDAO = require('./mySQLDAO')
var mongoDAO = require('./mongoDAO')
var app = express()

// Setup EJS
app.set('view engine', 'ejs')
app.use('/styles', express.static('styles'))
app.use(bodyParser.urlencoded({ extended: false }))

// Listen @ port 3000
app.listen(3000, () => {
    console.log("Server is listening @ localhost:3000")
})

//Home Page
app.get('/', (req, res) => {
    console.log("Opened Home Page")
    res.render('home');
})

// ------------------------Modules--------------------------

// Get Request to List Modules
app.get('/listModules', (req, res) => {
    // Log action
    console.log('Listing Modules')
    // Perform Select Query through MYSQL
    mySQLDAO.getQuery(`select * from module`)
        // Select succeeds
        .then((result) => {
            // Render EJS file with modules
            res.render("listModules", { modules: result })
        })
        // Select fails
        .catch((error) => {
            // log error
            res.send(error)
        })
})

// Post Request to List Modules, used for sorting the table
app.post('/listModules', [check('orderby').exists({checkFalsy:true})], (req,res) => {
    // Get Errors From Request Body
    const errors = validationResult(req)
    //If Errors are empty
    if(errors.isEmpty()){
        // Log Action
        console.log('Listing Modules with sort')
        // Perform Select Query with sort through MySQL
        mySQLDAO.getQuery(`select * from module ORDER By ${req.body.orderby}`)
            // Select succeeds
            .then((result) => {
                // Render EJS File with modules
                res.render("listModules", {modules: result})
            })
            // Select fails
            .catch((error) => {
                // Log error
                console.log(error)
                // Reload Page
                res.redirect('/listModules')
            })
    }else{
        // Log errors
        console.log(errors.errors)
        // Reload Page
        res.redirect('/listModules')
    }
})

//Edit Module Page
app.get('/module/edit/:mid', (req, res) => {
    // Log Action
    console.log('Editing Module')
    // Perform Select Query through MySQL
    mySQLDAO.getQuery(`select * from module where mid = '${req.params.mid}'`)
        // Select succeeds
        .then((result) => {
            // Render EJS file with errors and module
            res.render("editModule", { errors: undefined, module: result[0] })
        })
        // Select fails
        .catch((error) => {
            // Log error
            console.log(error)
        })
})

// Post request used to edit specific module
app.post('/module/edit/:mid', [
    check('name').isLength({ min: 5 }).withMessage("Module Name must be at least 5 characters")],
    (req, res) => {
        // Check Errors in Request Body
        const errors = validationResult(req)

        // Instantiate Variable
        let credits = req.body.credits
        // Check if credits is not equal to any of the following values
        if (credits != '5' && credits != '10' && credits != '15')
            //Add error to errors
            errors.errors.push({
                value: req.body.credits,
                msg: 'Credits can either be 5, 10, 15',
                param: 'credits',
                location: 'body'
            })
        // Check if Errors is Empty
        if (errors.isEmpty()) {
            // Log action
            console.log(req.body)
            // Perform update on specific module through MySQL
            mySQLDAO.getQuery(`update module set name='${req.body.name}', credits='${req.body.credits}' where mid='${req.body.mid}'`)
                // Update succeeds
                .then((result) => {
                    res.redirect('/listModules')
                })
                // Update fails
                .catch((error) => {
                    // Log error
                    console.log(error)
                    // Render EJS file with Errors and Module
                    res.render("editModule",
                        { errors: errors.errors, module: req.body })
                })
        }
        // Errors is not empty
        else {
            // Render EJS file with Errors and Module
            res.render("editModule",
                { errors: errors.errors, module: req.body })
        }
    })

// ------------------------Students & Module--------------------------

//List Students Studying Module Page
app.get('/module/students/:mid', (req, res) => {
    // Perfrom Select Query through MySQL
    mySQLDAO.getQuery(`select s.sid, s.name, s.gpa from student s inner join student_module sm on s.sid = sm.sid WHERE sm.mid = "${req.params.mid}"`)
        // Select succeeds
        .then((result) => {
            // Render EJS File
            res.render("listStudentsWM", { students: result, module: req.params.mid })
        })
        // Select fails
        .catch((error) => {
            // Display Error
            res.send(error)
        })
})
// Post request to sort of students studying module
app.post('/module/students/:mid', [check('orderby').exists({checkFalsy:true})], (req,res) => {
    // Check Errors with Request Body
    const errors = validationResult(req)
    // Check if Errors is empty
    if(errors.isEmpty()){
        // Log action
        console.log('Listing Modules with sort')
        // Perform Select Query with sort through MySQL
        mySQLDAO.getQuery(`select s.sid, s.name, s.gpa from student s inner join student_module sm on s.sid = sm.sid WHERE sm.mid = "${req.params.mid}" ORDER BY ${req.body.orderby}`)
        // Select succeeds
            .then((result) => {
                // Log result
                console.log(result)
                // Render EJS File
                res.render("listStudentsWM", { students: result, module: req.params.mid})
            })
            // Select fails
            .catch((error) => {
                // Display Error
                res.send(error)
            })
    }
    // Errors is not empty
    else{
        // Log Errors
        console.log(errors.errors)
        // Redirect Page
        res.redirect('/listModules')
    }
})

// ------------------------Students--------------------------

//List Students Page
app.get('/listStudents', (req, res) => {
    // Log action
    console.log("Listing Students")
    // Perform Select Query
    mySQLDAO.getQuery(`select * from student `)
        // Select succeeds
        .then((result) => {
            // Render EJS file with Students
            res.render("listStudents", { students: result })
        })
        // Select fails
        .catch((error) => {
            // Display error
            res.send(error)
        })
})
app.post('/listStudents', (req, res) => {
    // Log action
    console.log("Listing Students with sort " + req.body.orderby)
    // Perform Select Query with sort through MySQL
    mySQLDAO.getQuery(`select * from student ORDER BY ${req.body.orderby}`)
        // Select succeeds
        .then((result) => {
            // Render EJS File with Students
            res.render("listStudents", { students: result })
        })
        // Select fails
        .catch((error) => {
            // Display Error
            res.send(error)
        })
})
//Delete Student Page
app.get('/students/delete/:sid', (req, res) => {
    // Perform Delete Query through MySQL
    mySQLDAO.getQuery(`DELETE FROM student WHERE sid = '${req.params.sid}'`)
        // Delete succeeds
        .then((result) => {
            // Redirect page
            res.redirect('/listStudents')
        })
        // Delete fails
        .catch((error) => {
            // Render EJS file with student ID
            res.render("deleteStudent", { sid: req.params.sid })
        })
})
//Add Student Page
app.get('/addStudent', (req, res) => {
    // Render EJS File with errors and student information
    res.render("addStudent", { errors: undefined, sid: "", name: "", gpa: "" })
})
app.post('/addStudent', [
    check("sid").isLength({ min: 4, max: 4 }).withMessage("Student ID must be 4"),
    check("name").isLength({ min: 5 }).withMessage("Name must be atleast 5 characters"),
    check("gpa").isFloat({ min: 0.0, max: 4.0 })], (req, res) => {
        // Log Request Body
        console.log(req.body)
        // Check errors in Request
        const errors = validationResult(req);
        // Check if Errors is empty
        if (errors.isEmpty()) {
            // Perform Insert Query through MySQL
            mySQLDAO.getQuery(`insert into student (sid, name, gpa) values ("${req.body.sid}","${req.body.name}","${req.body.gpa}")`)
                // Insert succeeds
                .then((result) => {
                    // Redirect to page
                    res.redirect('/listStudents')
                })
                // Insert fails
                .catch((error) => {
                    // Add Error to Errors Array
                    errors.errors.push({ msg: `Error: ${error.code}: ${error.sqlMessage}` })
                    // Render EJS File with Errors and Student Information
                    res.render("addStudent",
                        { errors: errors.errors, sid: req.body.sid, name: req.body.name, gpa: req.body.gpa })
                })

        }
        // Errors is not Empty 
        else {
            // Render EJS File with errors and Student Information
            res.render("addStudent",
                { errors: errors.errors, sid: req.body.sid, name: req.body.name, gpa: req.body.gpa })
        }
    })

//-----------------------Lecturers-------------------------
//List Lecturers Page
app.get('/listLecturers', (req, res) => {
    mongoDAO.find({}, '+_id')
        .then((result)=>{
            res.render("listLecturers", { lecturers: result })
        })
        .catch((error)=>{
            console.log(error)
        })
})
//Add Lecturer Page
app.get('/addLecturer',(req, res) => {
    // Render EJS File with Errors and Lecturer information
    mongoDAO.distinct('dept')
        .then((result) => {
            console.log(result)
            res.render("addLecturer", { errors: undefined, _id: "", name: "", dept: "", departments: result })
        })
        .catch((error) => {
            // Log Error
            console.log(error)
            // Redirect to Page
            res.redirect('/listLecturers')
        })
    
})
app.post('/addLecturer', [check("_id").isLength({min:4, max:4}).withMessage("Lecturer ID must be 4 characters"),
    check("name").isLength({min:5}).withMessage("Name must be atleast 5 characters"),
    check("dept").isLength({min:3, max:3}).withMessage("Dept must be 3 characters long")], (req, res) => {
        // Check Errors in Request
        const errors = validationResult(req)
        var attemptInsert = false
        var results
        // Perform Find Query through MongoDB
        mongoDAO.distinct('dept')
            // Distinct Find succeeds
            .then((result) => {
                // Check if Department exists
                if(result.includes(req.body.dept)){
                    attemptInsert = true
                    results = result
                }
                // Department doesn't exist
                else{
                    results = undefined
                    // Add Error to Errors Array
                    errors.errors.push({msg: "Dept doesn't exist"})
                }
            })
            // Distinct Find fails
            .catch((error) => {
                // Log Error
                console.log(error)
                // Add Error to Errors Array
                errors.errors.push(error)
            })
        // Department Exists
        if(attemptInsert){
            // Perform Insert Query through MongoDB
            mongoDAO.insertInto({_id: req.body._id, name: req.body.name, dept: req.body.dept})
                // Insert succeeds
                .then(() => {
                    // Redirect to page
                    res.redirect('/listLecturers')
                })
                // Insert fails
                .catch((error) => {
                    // Log error
                    console.log(error)
                    // Add Error to Errors Array
                    errors.errors.push({msg: "_id already exists"})
                    // Render EJS File with Errors and Lecturer Information
                    res.render("addLecturer", 
                        {errors: errors.errors, _id: req.body._id, name: req.body.name, dept:req.body.dept, departments: results})
                })
        } 
        // Errors is not empty
        else {
            // Render EJS File with Errors and Lecturer Information
            res.render("addLecturer",
                { errors: errors.errors, _id: req.body._id, name: req.body.name, dept: req.body.dept, departments: results })
        }

})