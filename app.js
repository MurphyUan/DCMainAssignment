//Package Importing
var express = require('express')
var bodyParser = require('body-parser')
var { check, validationResult } = require('express-validator')
var ejs = require('ejs')
//File Importing
var mySQLDAO = require('./mySQLDAO')
var app = express()

app.set('view engine', 'ejs')
app.use('/styles', express.static('styles'))
app.use(bodyParser.urlencoded({ extended: false }))

app.listen(3000, () => {
    console.log("Server is listening @ localhost:3000")
})

//Home Page
app.get('/', (req, res) => {
    console.log("Opened Home Page")
    res.render('home');
})

//------------------------MySQL--------------------------

//List Modules Page
app.get('/listModules', (req, res) => {
    console.log('Listing Modules')
    mySQLDAO.getQuery("select * from module")
        .then((result) => {
            res.render("listModules", { modules: result })
        })
        .catch((error) => {
            res.send(error)
        })
})

//Edit Module Page
app.get('/module/edit/:mid', (req, res) => {
    console.log('')
    mySQLDAO.getQuery(`select * from module where mid = '${req.params.mid}'`)
        .then((result) => {
            console.log(result)
            res.render("editModule", { errors: undefined, module: result[0] })
        })
        .catch((error) => {
            console.log(error)
        })
})

app.post('/module/edit/:mid', [
    check('name').isLength({ min: 5 }).withMessage("Module Name must be at least 5 characters")], (req, res) => {
        const errors = validationResult(req)

        let x = req.body.credits
        if (x != '5' && x != '10' && x != '15')
            errors.errors.push({
                value: req.body.credits,
                msg: 'Credits can either be 5, 10, 15',
                param: 'credits',
                location: 'body'
            })

        if (errors.isEmpty()) {
            console.log(req.body)
            mySQLDAO.getQuery(`update module set name='${req.body.name}', credits='${req.body.credits}' where mid='${req.body.mid}'`)
                .then((result) => {
                    res.redirect('/listModules')
                })
                .catch((error) => {
                    console.log(error)
                    res.redirect('/listModules')
                })
        }
        else {
            res.render("editModule",
                { errors: errors.errors, module: req.body })
        }
    })
//List Students Studying Module Page
app.get('/module/students/:mid', (req, res) => {
    mySQLDAO.getQuery(`select s.sid, s.name, s.gpa from student s inner join student_module sm on s.sid = sm.sid WHERE sm.mid = "${req.params.mid}"`)
        .then((result) => {
            res.render("listStudentsWM", { students: result, module: req.params.mid })
        })
        .catch((error) => {
            res.send(error)
        })
})
//List Students Page
app.get('/listStudents', (req, res) => {
    mySQLDAO.getQuery("select * from student")
        .then((result) => {
            res.render("listStudents", { students: result })
        })
        .catch((error) => {
            res.send(error)
        })
})
//Delete Student Page
app.get('/students/delete/:sid', (req, res) => {
    mySQLDAO.getQuery(`DELETE FROM student WHERE sid = '${req.params.sid}'`)
        .then((result) => {
            res.redirect('/listStudents')
        }).catch((error) => {
            res.render("deleteStudent", { sid: req.params.sid })
        })
})
//Add Student Page
app.get('/addStudent', (req, res) => {
    res.render("addStudent", { errors: undefined, sid: "", name: "", gpa: "" })
})
app.post('/addStudent', [
    check("sid").isLength({ min: 4, max: 4 }).withMessage("Student ID must be 4"),
    check("name").isLength({ min: 5 }).withMessage("Name must be atleast 5 characters"),
    check("gpa").isFloat({ min: 0.0, max: 4.0 })], (req, res) => {
        console.log(req.body)
        const errors = validationResult(req);
        if (errors.isEmpty()) {

            mySQLDAO.getQuery(`insert into student (sid, name, gpa) values ("${req.body.sid}","${req.body.name}","${req.body.gpa}")`)
                .then((result) => {
                    res.redirect('/listStudents')
                })
                .catch((error) => {
                    errors.errors.push({ msg: `Error: ${error.code}: ${error.sqlMessage}` })
                    res.render("addStudent",
                        { errors: errors.errors, sid: req.body.sid, name: req.body.name, gpa: req.body.gpa })
                })

        } else {
            res.render("addStudent",
                { errors: errors.errors, sid: req.body.sid, name: req.body.name, gpa: req.body.gpa })
        }
    })

//-----------------------MongoDB-------------------------
//List Lecturers Page
app.get('/listLecturers', (req, res) => {
    res.send("<h1>List Lecturers<h1>")
    res.render("listLecturers")
})
//Add Lecturer Page
app.get('/addLecturer', (req, res) => {
    res.send("Add Lecturer")
})
app.post('/addLecturer', (req, res) => {

})