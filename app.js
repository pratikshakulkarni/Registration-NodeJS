const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');

//for limiting hardcoded values
dotenv.config({path: './.env'});
const app = express();

const db = mysql.createConnection({
    port:process.env.PORT,
    host:process.env.HOST,
    user:process.env.USER,
    password:process.env.PASSWORD,
    database:process.env.DATABASE
});

const publicDirectory = path.join(__dirname,'./public');
app.use(express.static(publicDirectory));

//used for put and post req to tell server accept the data sent with the req.
app.use(express.urlencoded({extended:false}));

//accept the req in the form of JSON object
app.use(express.json());

//cookie-parser is a middleware which parses the cookies in the client req.
app.use(cookieParser());

//to dynamically create and update a page with the values..unlike static html pages
app.set('view engine','hbs');

db.connect((error) => {
    if(error) console.log(error);
    else console.log("mysql connected");
});

//Define routes
app.use('/', require('./routes/pages'));
app.use('/auth',require('./routes/auth'));

app.listen(3000,()=>{
    console.log("Server running");
});