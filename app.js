const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');

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
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cookieParser());

app.set('view engine','hbs');

db.connect((error) => {
    if(error) console.log(error);
    else console.log("mysql connected");
});
//Define routes
app.use('/', require('./routes/pages'));
app.use('/auth',require('./routes/auth'))

app.listen(3000,()=>{
    console.log("Server running");
});