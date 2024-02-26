const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
const {getRandomInt} = require('../../config/helpers')

const adminModel = require('../../models/admin/adminModel')
const AdminDB = new adminModel();


    // =======================REGISTER=======================
    router.post('/register', (req, res) => {
        console.log('register...')
        // get values in request
        let {email, password}  = req.body;
    
        //Hashing the password
        const hashedpassword = bcrypt.hashSync(password, salt);

        //generate OTP code 
        var OTP = getRandomInt(999,9999);
        console.log('OTP', OTP)
    
        // Register new user 
        AdminDB.register_user(email,hashedpassword,
            (resp)=>{
                if(resp.status ==true){
                    console.log('User Registered');
                    res.status(201).json({
                        status:true,
                        message: 'New Admin registered',
                        user: resp.response
                    });
                    return;
                }else{
                    res.status(404).json({
                        status: false,
                        message: 'Unsuccessful registration',
                        other: resp.message
                    });
                    return;
                }
            })
    });

    // =======================LOGIN=======================
    router.post('/login', async (req, res)=>{
        var {email, password} = req.body;
    
        //CHECK email and password if empty
        if(!email || !password){
            return res.status(404).json({
                status: false, 
                message: 'Enter all login details!'
            })
         
        }
           AdminDB.get_user(email, (response)=>{
                if(response.status==true){
                    bcrypt.compare(password, response.response.password).then((result)=>{
                    if(result ==true){
                        console.log('bcrypt message', result)
                         //sending response 
                        return res.json({
                            status: true,
                            message: response.message,
                            response: response.response
                        }) 
                    }else{
                        res.status(404).json({
                            status: false, 
                            message: 'password incorrect!', 
                        })
                    }
               }).catch((err)=>{ 
                   res.status(404).json({
                    status: false, 
                    message: 'password error!',
                    other:response.message, 
                })
                return;
               })
            }
            else{
                res.status(404).json({
                    status: false,
                    message: "Admin doesn't exist!",
                    other:response.message
                }) 
            } 
        });
         
    });



module.exports = router