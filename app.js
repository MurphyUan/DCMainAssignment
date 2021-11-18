const express = require('express')
const bodyParser = require('body-parser')
const {check, validationResult} = require('express-validator')
const ejs = require('ejs')
const app = express()

app.set('view engine','ejs')
app.set('views','./views')

app.use(bodyParser.urlencoded({extended: false}))

app.listen(3000, ()=>{
    console.log("Server is listening @ localhost:3000")
})

//Home Page
app.get('/',(req,res)=>{
    res.render('home');
})

//List Modules Page
app.get('/listModules', (req,res)=>{

})

//Edit Module Page
app.get('/module/edit/:mid', (req,res)=>{

})

app.post('/module/edit/:mid', (req,res)=>{
    
})
//List Students Studying Module Page
app.get('/module/students/:mid', (req,res)=>{

})
//List Students Page
app.get('/listStudents', (req,res)=>{

})
//Delete Student Page
app.get('/students/delete/:sid', (req,res)=>{

})
//Add Student Page
app.get('/addStudent', (req,res)=>{

})
app.post('/addStudent', (req,res)=>{

})

//-----------------------MongoDB-------------------------
//List Lecturers Page
app.get('/listLecturers', (req,res)=>{

})
//Add Lecturer Page
app.get('/addLecturer', (req,res)=>{

})
app.post('/addLecturer', (req,res)=>{

})