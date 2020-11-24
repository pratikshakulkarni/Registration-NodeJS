const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = mysql.createConnection({
    port:process.env.PORT,
    host:process.env.HOST,
    user:process.env.USER,
    password:process.env.PASSWORD,
    database:process.env.DATABASE
});

exports.register = (req,res) => {
    console.log(req.body);

    const {fname,lname,email,password,confirmPassword,mobileNumber} = req.body;

    db.query("select email from user_details where email = ?", [email],async (error,result) => {
        if(error) console.log(error);
        if(result.length > 0){ 
            return res.render('register',{
            message:`This email ${email} is already registered.`
        });
    }else if(password !== confirmPassword){
        return res.render("register",{
            message:`passwords do not match.`
        });
    }

    let hasedPassword = await bcrypt.hash(password,5);
    console.log(hasedPassword);

    db.query('INSERT into user_details SET ?',
     {first_name:fname,last_name:lname,email:email,password:hasedPassword,mobile_number:mobileNumber}, (error,results) => {
        if(error)console.log(error)
        else{
            console.log(results);
            return res.render('register', {
                message:`User Registered`
            });
        }
     });
    });  
}

exports.login = async (req,res) => {
    try {
        const {email,password} = req.body;

        if(!email || !password){
            return res.status(400).render('login',{
                message:`Please provide an email and password`
            });
        }

        db.query('SELECT * from user_details where email = ?',[email],async(error,results) => {
            if(!results || !(await bcrypt.compare(password,results[0].password))){
                res.status(401).render('login',{
                message:`Email or password incorrect`
             })
            }else{
                const id = results[0].id

                const token = jwt.sign({id},process.env.JWT_SECRET,{
                    expiresIn: process.env.JWT_EXPIRES_IN
                });

                console.log("token :" + token);

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES*24*60*60*1000
                    ),
                    httpOnly:true
                }

                res.cookie('jwt',token,cookieOptions);
                res.status(200).redirect("/");
            }
        });
        
        
    } catch (error) {
        console.log(error);
    }
}