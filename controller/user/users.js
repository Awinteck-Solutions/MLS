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


const User = require('../../scheme/userModel')


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
        var otp = getRandomInt(999,9999);
    
        // Register new user 

        const user = User({
            firstname, lastname, email,otp,
            password: hashedpassword
        })
        user.save().then((result) => {
            return res.status(201).json({
                status:true,
                message: 'New User registered',
                user: result
            });
        }).catch((error) => {
            return res.status(404).json({
                status: false,
                message: 'Unsuccessful registration',
                other: error
            });
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
        User.findOne({ email })
        .then((response) => {
            console.log('result :>> ', response);
            let remotePassword = response.password;
            bcrypt.compare(password, remotePassword).then((result)=>{
                if(result ==true){
                    console.log('bcrypt message', result)
                     //sending response 
                    return res.json({
                        status: true,
                        message: 'Login success',
                        response
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
            })
            return;
           })
            
        }).catch((error) => {
            res.status(404).json({
                status: false, 
                message: 'password incorrect!', 
            })
    })
         
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
        User.updateOne({_id:user_id}, {firstname,lastname}, {upsert:false})
        .then((result) => {
            return res.status(201).json({
                status:true,
                message: 'User update success', 
            });
        }).catch((error) => {
            return res.status(404).json({
                status: false,
                message: 'User update failed',
                other: error
            });
        })
         
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
        User.findOne({email})
        .then((result) => {
            let otp = result.otp;
            messenger(email, otp, (mesRes) => {
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
        }).catch((error) => {
            return res.status(404).json({
                status: false,
                message: 'User update failed',
                other: error
            });
        })
    })

    // =======================RESET_PASSWORD=======================
    router.post('/resetpassword', (req, res) => {
        let { otp, password } = req.body;
        if (!otp && !password) {
            return res.status(401).json({
                status: false,
                message:"otp_code/password can't be empty"
            })
        }
        let hashedpassword = bcrypt.hashSync(password, 10);
        User.updateOne({otp}, {password:hashedpassword}, {upsert:false})
        .then((result) => {
            return res.status(201).json({
                status:true,
                message: 'User update password success', 
            });
        }).catch((error) => {
            return res.status(404).json({
                status: false,
                message: 'User update password failed',
                other: error
            });
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
                User.updateOne({_id:user_id}, {image}, {upsert:true})
                .then((result) => {
                    return res.status(201).json({
                        status:true,
                        message: 'User update success', 
                    });
                }).catch((error) => {
                    return res.status(404).json({
                        status: false,
                        message: 'User update failed',
                        other: error
                    });
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
        User.updateOne({_id:user_id}, {password:hashedpassword}, {upsert:false})
        .then((result) => {
            return res.status(201).json({
                status:true,
                message: 'User update success', 
            });
        }).catch((error) => {
            return res.status(404).json({
                status: false,
                message: 'User update failed',
                other: error
            });
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
        User.findOne({_id:id})
        .then((result) => {
            return res.status(201).json({
                status:true,
                message: 'User success', 
                response:result
            });
        }).catch((error) => {
            return res.status(404).json({
                status: false,
                message: 'User failed',
                other: error
            });
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
        User.deleteOne({_id:id})
        .then((result) => {
            return res.status(201).json({
                status:true,
                message: 'User delete success', 
            });
        }).catch((error) => {
            return res.status(404).json({
                status: false,
                message: 'User delete failed',
                other: error
            });
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