const express = require('express')
const tasknex = express.Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const config = require('../config');
const { v4: uuidv4 } = require('uuid');
const User = require('./userModal');

tasknex.use(bodyParser.urlencoded({extended:true}));
tasknex.use(bodyParser.json())



//get all users
tasknex.get('/users',(req,res) => {
    User.find({},(err,data) => {
        if(err) throw err;
        res.send(data)
    })
})

//register users
tasknex.post('/register',(req,res) => {
    // encrypt password
    let hashpassword = bcrypt.hashSync(req.body.password,8);
    let email =req.body.email
    User.find({email:email},(err,data) => {
        if(data.length>0){
            console.log(data)
            res.status(500).send({auth:false,token:'Email Is Not Available'})
        }else{
            // Generate a unique user ID
            const userId = uuidv4();
            User.create({
                userId: userId,
                fname:req.body.fname,
                lname:req.body.lname,
                email:req.body.email,
                password:hashpassword,
                phone:req.body.phone,
                department:req.body.department,
                role:req.body.role?req.body.role:'User'
            },(err,data) => {
                if(err) return res.status(500).send('Enter valid Details')
                res.status(200).send('Thanks for Registering with us')
            })
        }
    })
    
})

//login user
tasknex.post('/login',(req,res) => {
    User.findOne({email:req.body.email},(err,user) => {
        if(err) return  res.status(500).send({auth:false,token:'Error while login'})
        if(!user) return  res.status(500).send({auth:false,token:'No user Found'})
        else{
            // compare the password
            const passIsValid = bcrypt.compareSync(req.body.password,user.password)
            if(!passIsValid) return res.status(500).send({auth:false,token:'Invalid Password'})
            // in case password is valid
            let token = jwt.sign({id:user._id}, config.secret, {expiresIn:86400}) //24 hr
            res.send({auth:true,token:token})
        }
    })
})

//Profile
tasknex.get('/userInfo',(req,res) => {
    let token = req.headers['x-access-token']
    if(!token)  return res.status(500).send({auth:false,token:'No Token Provided'})
    // verify token
    jwt.verify(token, config.secret, (err,user) =>{
        if(err) res.status(500).send({auth:false,token:'Invalid Token'})
        User.findById(user.id,(err,result) => {
            res.send(result)
        })
    })
})




module.exports =tasknex