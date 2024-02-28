const express = require('express');
const router = express.Router();
const multer = require('multer')

const nodemailer = require('nodemailer'); 
const Email = require('../../scheme/emailModel')
const { readCSV } = require('../../config/helpers')

const upload = multer({ storage: multer.memoryStorage() })



// BROADCAST EMAIL
router.post('/send', (req, res) => {
    let { emails,subject,message,authorId } = req.body;
    if (!emails || !subject || !message || !authorId) {
        return res.status(401).json({
            status: false,
            message:"missing fields"
        })
    }
    if (emails.length > 100) { 
        return res.status(401).json({
            status: false,
            message:"Your limit is 100 recipients"
        })
    }
    try {
        let saveEmails = Email({
            recipients: emails,
            subject,
            body: message,
            author: authorId
        })
        global.failedEmails  = []
        saveEmails.save().then((result) => {
            
            emails.map((email,index) => {
                messenger(email, subject,message, (mesRes) => {
                    console.log('mesRes',mesRes)
                    if (mesRes.status) {
                        console.log('truemesRes',mesRes)
                        
                    } else {
                        console.log('falsemesRes',mesRes)
                        failedEmails.push(email)
                    }
                })
                if (++index == emails.length) {
                    return res.status(201).json({
                        status: true,
                        message: 'Successfully initiated emailing...'
                    })
                }
            })
        }).catch((error) => {
            return res.status(404).json({
                status: false,
                message: 'Email broadcast failed'
            });
        })

    } catch (error) {
        console.log('error :>> ', error);
        return res.status(404).json({
            status: false,
            message: 'Failed to initial emailing...'
        })
    }
})

// BROADCAST EMAIL WITH CSV FILE
router.post('/send/csv', upload.single('upload'), (req, res) => {
    let { subject, message, authorId } = req.body;
    const file = req.file

    if (!file || !subject || !message || !authorId) {
        return res.status(401).json({
            status: false,
            message:"missing fields"
        })
    }

    try {
        readCSV(file, (response) => {
            let emails_from_csv = response.emails
            if (emails_from_csv.length > 100) { 
                return res.status(401).json({
                    status: false,
                    message:"Your limit is 100 recipients"
                })
            }
            else {
                let saveEmails = Email({
                    recipients: emails_from_csv,
                    subject,
                    body: message,
                    author: authorId
                })
                saveEmails.save().then((result) => {
                    
                    emails_from_csv.map((email,index) => {
                        messenger(email, subject,message, (mesRes) => {
                            console.log('mesRes',mesRes)
                            if (mesRes.status) {
                                console.log('truemesRes',mesRes)
                                
                            } else {
                                console.log('falsemesRes',mesRes)
                            }
                        })
                        if (++index == emails_from_csv.length) {
                            return res.status(201).json({
                                status: true,
                                message: 'Successfully initiated emailing...'
                            })
                        }
                    })
                }).catch((error) => {
                    return res.status(404).json({
                        status: false,
                        message: 'Email broadcast failed'
                    });
                })
            }
        })
        
    } catch (error) {
        console.log('error :>> ', error);
        return res.status(404).json({
            status: false,
            message: 'Failed to initial emailing...'
        })
    }
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


const messenger = (email, subject,message, callback) => {
    let mailOptions = {
        from: '"MSL Business" <support@storykids.app>',
        to: email,
        subject: subject,
        html: `${message}`
    }
    transporter.sendMail(mailOptions, function(error, info){
        if(error){ 
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