// Importing and running express
require('dotenv').config()

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');


const Product = require('./models/product');
const User = require('./models/user');

const PORT = process.env.PORT || 8080
//const dbUrl = process.env.DB_URL
//Establishing connection to db server
mongoose.connect('mongodb://127.0.0.1:27017/ecom')
    .then(() => {
        console.log("Mongo Connection Open")
    })
    .catch(err =>{
        console.log("Encountered error in establishing mongo connection")
        console.log(err)
    });

// Parse any data coming from a form or as a JSON
app.use(express.urlencoded({ extended : true}))
app.use(express.json())

//Setting view engine to EJS
app.set('view engine','ejs');

//Setting path for views and public assets
app.set('views', path.join(__dirname, '/views'))
app.use(express.static(path.join(__dirname, 'public')))

//Defining variables and objects
/*
**** Objects and Functions
*/

//console.log("My name is ",process.env.myname)
let currentUser = {
    "id" : 0,
    "name" : ''
}
let cart = []
// Routing methods for CRUD operations
app.get('/',(req,res) =>{
    res.redirect('login');
})
app.get('/login',(req,res) =>{
    const { errorMsg } = req.params;
    res.render('login',{errorMsg});
})
app.get('/register',(req,res) =>{
    const { errorMsg } = req.params;
    res.render('register',{errorMsg});
})
app.get('/register',(req,res)=>{
    res.render('register');
})
app.get('/home',(req,res) =>{
    console.log(req.params);
    res.render('index');
})

/* ********************************
POST Request Routing
*********************************** 
*/
//*********************** Portal Login ***********************
app.post('/login', async (req,res) =>{
    console.log(req.body);
    const user = await User.findOne({email: req.body.email});
    console.log('User DB Details', user)
    let errorMsg = 'Invalid user credentials, try again!!!'
    if(user){
        if(user.password === req.body.password){
            console.log(`User ${user.username} logged in`)
            currentUser.id = user._id;
            currentUser.name = user.name;
            res.redirect('/home');
        }
        else{
            errorMsg = 'Invalid password!!!';
            res.render('login',{errorMsg});
        }
    }
    else{
        res.render('login',{errorMsg});
    }
})
app.post('/register', async(req,res) =>{
    console.log(req.body);
    const userExisting = await User.findOne({email: req.body.email});
    if(userExisting){
        const errorMsg = 'User account with same mail-id already exists';
        res.render('register',{errorMsg});
    }
    else{
        const newUser = new User(req.body);
        await newUser.save();
        console.log('New User',newUser);
        const errorMsg = 'User added successfully';
        res.render('register',{errorMsg});
    }
})
app.listen(PORT, () => {
    console.log('Listening to server at port',PORT);
})
