const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const bodyparser = require('body-parser')
const nodemailer = require('nodemailer'); 
const fs = require('fs');
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
var { getRandomInt } = require('../../config/helpers')
const { uploadFile } = require('../../config/s3')

const userModel = require('../../models/user/userModel')
const UserDB = new userModel();



//Set up middlewares
router.use(bodyparser.json());
router.use(bodyparser.urlencoded({ extended: false }));


const upload = multer({ storage: multer.memoryStorage() })


    // =======================REGISTER=======================
    router.post('/register', (req, res) => {
        console.log('register...')
        // get values in request
        let {firstname, lastname, email, password}  = req.body;
    
        //Hashing the password
        const hashedpassword = bcrypt.hashSync(password, salt);

        //generate OTP code 
        var OTP = getRandomInt(999,9999);
        console.log('OTP', OTP)
    
        // Register new user 
        UserDB.register(firstname,lastname,email,hashedpassword,OTP,
            (resp)=>{
                if(resp.status ==true){
                    console.log('User Registered');
                    res.status(201).json({
                        status:true,
                        message: 'New user registered',
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
           UserDB.find_user(email, (response)=>{
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
                    message: "User doesn't exist!",
                    other:response.message
                }) 
            } 
        });
         
    });

     // =======================UPDATE PROFILE=======================
     router.post('/profile/update', (req, res)=>{
        var {user_id, firstname,lastname} = req.body;
    
        //CHECK email_phone and password if empty
        if(!user_id || !firstname || !lastname){
            return res.status(404).json({
                status: false, 
                message: 'Payload can\'t be empty!'
            })
         
        }
           UserDB.update(user_id,firstname,lastname, (response)=>{
                if(response.status==true){
                    res.status(200).json({
                        status: true,
                        message: response.message
                    }) 
                }
                else{
                    res.status(404).json({
                        status: false,
                        message: response.message
                    }) 
                } 
        });
         
    });

    // =======================FORGET_PASSWORD=======================
    router.post('/forgotpassword', (req, res) => {
        let { email } = req.body;
        if (!email) {
            return res.status(401).json({
                status: false,
                message:"email can't be empty"
            })
        }
        UserDB.find_otpCode(email, (response) => {
            if (response.status) {
                let otp_code = response.response.otp_code;
                messenger(email, otp_code, (mesRes) => {
                    if (mesRes.status === true) {
                        return res.status(200).json({
                            status: true,
                            message: 'Reset Password code sent to your Email',
                            response: response.response
                        })
                    } else {
                        return res.status(404).json({
                            status: false,
                            message: 'User did not recieve code, try again'
                        })
                    }
                })
               
            } else {
                return res.status(403).json({
                    status: false,
                    message: response.message,
                })
            }
        })
    })

    // =======================RESET_PASSWORD=======================
    router.post('/resetpassword', (req, res) => {
        let { otp_code, password } = req.body;
        if (!otp_code && !password) {
            return res.status(401).json({
                status: false,
                message:"otp_code/password can't be empty"
            })
        }
        let hashedpassword = bcrypt.hashSync(password, 10);
        UserDB.reset_password(otp_code,hashedpassword, (response) => {
            if (response.status) {
                return res.status(200).json({
                    status: true,
                    message: response.message,
                    response: response.response
                })
            } else {
                return res.status(403).json({
                    status: false,
                    message: response.message,
                })
            }
        })
    })

    // =======================PROFILE_UPLOAD=======================
    router.post('/upload_image', upload.single('upload'), async (req, res)=>{
        var { user_id } = req.body;
        const file = req.file
        
        if (!file || !user_id ) return res.status(400).json({
            error: 'Missing fields'
        });
        try {
            const result = await uploadFile(file)
            if (result) {
                let image = `/res/${result.Key}`
                    UserDB.upload_profile(user_id, image, (response)=>{
                        if(response.status ==true){
                            res.status(201).json({
                                status: true,
                                image,
                                message: response.message,
                                other: 'Updated successfully'
                            });
                            return;
                        }else{
                            res.status(404).json({
                                status: false,
                                message: response.message
                            });
                            return;
                        }
                    }) 
               
            }else{
                console.log('result null')
                res.status(400).json({
                    status: false,
                    message: "image upload failed"
                })
            }
        }
        catch (e){
            console.log('error hello', e)
            res.status(400).send(e)
            }
        }, (error, req, res, next) => {
            res.status(400).json({error: error.message})  
    })

    // =======================CHANGE_PASSWORD=======================
    router.post('/changepassword', (req, res) => {
        let { user_id, password } = req.body;
        if (!user_id && !password) {
            return res.status(401).json({
                status: false,
                message:"user_id/password can't be empty"
            })
        }
        let hashedpassword = bcrypt.hashSync(password, 10);
        UserDB.change_password(user_id,hashedpassword, (response) => {
            if (response.status) {
                return res.status(200).json({
                    status: true,
                    message: response.message,
                    response: response.response
                })
            } else {
                return res.status(403).json({
                    status: false,
                    message: response.message,
                })
            }
        })
    })

    // =======================USER INFO=======================
    router.get('/profile/:id', (req, res) => {
        let { id } = req.params;
        if (!id) {
            return res.status(401).json({
                status: false,
                message:"user id can't be empty"
            })
        }
        UserDB.find_user_by_id(id, (response) => {
            if (response.status) {
                return res.status(200).json({
                    status: true,
                    message: response.message,
                    response: response.response
                })
            } else {
                return res.status(403).json({
                    status: false,
                    message: response.message,
                })
            }
        })
    })

    // =======================USER ACCOUNT DELETION=======================
    router.get('/delete/:id', (req, res) => {
        let { id } = req.params;
        if (!id) {
            return res.status(401).json({
                status: false,
                message:"user id can't be empty"
            })
        }
        UserDB.delete(id, (response) => {
            if (response.status) {
                return res.status(200).json({
                    status: true,
                    message: response.message
                })
            } else {
                return res.status(403).json({
                    status: false,
                    message: response.message,
                })
            }
        })
    })

 



let transporter = nodemailer.createTransport({
    // host: 'server1.web-hosting.com',
    // host: 'mx2-hosting.jellyfish.systems',
    host:'storykids.app',
    port:465,
    secure: true,
    authMethod:"PLAIN",
    auth: { 
        user: 'support@storykids.app',
        pass: '2(zwc{r5+Nad'
    },            
})



const messenger =(email, token,callback) => {

    // let email_phone = '233547785025'
    // let email_phone = 'awinsamp@yahoo.com'
    let regex = /\S+@\S+\.\S+/;
    let checkEmail =    regex.test(email)
    
    console.log('checkEmail :>> ', checkEmail);

    if (checkEmail) {
        email(email, token, (response) => {
            return callback({
                checkEmail,
                ...response
            })
            // return res.send(response.message)
            
        })
    }
}


 
const email = (email, token, callback) => {
    let mailOptions = {
        from: '"MSL Business" <support@MSLBusiness.com>',
        to: email,
        subject: 'MSL Business Password Reset',
        html: `Your password reset code: ${token}.
        \n Don't share this code with anyone.`
    }
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log('error email', error)
            return callback({
                status: false,
                message: "Error sending the email"
                })
        }
        else{ 
            return callback({
                status: true,
                message: "Email sent Successfully"
                })
        }
    })
}


module.exports = router