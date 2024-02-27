const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);

const Admin = require('../../scheme/adminModel')

    // =======================REGISTER=======================
    router.post('/register', (req, res) => {
        console.log('register...')
        // get values in request
        let {email, password}  = req.body;
    
        if (!email || !password ) return res.status(400).json({
            error: 'Missing fields'
        });

        //Hashing the password
        const hashedpassword = bcrypt.hashSync(password, salt);

    
        // Register new user 
        const admin = Admin({
            email: email,
            password: hashedpassword
        })
        
        admin.save().then((result) => {
            return res.status(201).json({
                status:true,
                message: 'New Admin registered',
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

        Admin.findOne({ email })
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




module.exports = router