const express = require('express');
const router = express.Router();
const multer = require('multer')
const mongoose = require('mongoose')
const Enrolled = require('../../scheme/enrollModel')
const User = require('../../scheme/userModel')
const { readCSV } = require('../../config/helpers')
const upload = multer({ storage: multer.memoryStorage() })

// ENROLL SINGLE USER
router.post('/add/one', (req, res) => {
    let { email, courseId } = req.body;

    if (!email || !courseId) return res.status(400).json({
        error: 'Missing fields'
    });

    const enrolled = Enrolled({
        email, course:courseId,
    })
    enrolled.save().then((result) => {
        return res.status(201).json({
            status:true,
            message: 'New user enrolled added',
            response: result
        });
    }).catch((error) => {
        return res.status(404).json({
            status: false,
            message: 'User enrolling failed',
            other: error
        });
    })
})

// REMOVE ENROLLED USER
router.get('/delete/:id', (req, res) => {
    let { id } = req.params;
    if (!id) return res.status(400).json({
        error: 'Missing fields'
    });

    Enrolled.deleteOne({_id:id}).then((result) => {
        return res.status(201).json({
            status:true,
            message: 'Enrolled User delete'
        });
    }).catch((error) => {
        return res.status(404).json({
            status: false,
            message: 'Enrolled user deleting failed',
            other: error
        });
    })
})

// TOGGLE ENROLLED USER
router.post('/update', (req, res) => {
    let { id, status, email } = req.body;
    if (!id || !status || !email) return res.status(400).json({
        error: 'Missing fields'
    });

    Enrolled.updateOne({ _id: id }, {status, email}, {upsert:false}).then((result) => {
        return res.status(201).json({
            status:true,
            message: 'Enrolled User updated'
        });
    }).catch((error) => {
        return res.status(404).json({
            status: false,
            message: 'Enrolled user updating failed',
            other: error
        });
    })
})

// ENROLL MULTIPLE USERS
router.post('/add/many', (req, res) => {
    let { emails, courseId } = req.body;
    if (!emails || !courseId) return res.status(400).json({
        error: 'Missing fields'
    });

    const enrolled = [
        ...emails.map((email) => {
            console.log('value :>> ', email);
            return { 'email': email, 'course': courseId }
        })
    ]

    Enrolled.insertMany(enrolled).then((result) => {
        return res.status(201).json({
            status:true,
            message: 'New user enrolled added',
            response: result
        });
    }).catch((error) => {
        return res.status(404).json({
            status: false,
            message: 'User enrolling failed',
            other: error
        });
    })
})

// ENROLL MULTIPLE USERS WITH CSV FILE
router.post('/add/csv', upload.single('upload'), (req, res) => {
    let { courseId } = req.body;
    let file = req.file;
    if (!file || !courseId) return res.status(400).json({
        error: 'Missing fields'
    });
    

    try {
        readCSV(file, (response) => {
            let emails_from_csv = response.emails

            const enrolled = [
                ...emails_from_csv.map((email) => {
                    console.log('value :>> ', email);
                    return { 'email': email, 'course': courseId }
                })
            ]
        
            Enrolled.insertMany(enrolled).then((result) => {
                return res.status(201).json({
                    status:true,
                    message: 'New user enrolled added',
                    response: result
                });
            }).catch((error) => {
                return res.status(404).json({
                    status: false,
                    message: 'User enrolling failed',
                    other: error
                });
            })
        
        })
    } catch (error) {
        console.log('error :>> ', error);
        return res.status(404).json({
            status: false,
            message: 'Failed to initial emailing...'
        })
    }
})




// GET ALL ENROLLED USERS BY COURSE
router.get('/course/:id', (req, res) =>{
    let { id } = req.params;
    if (!id) return res.status(400).json({
        error: 'Missing fields'
    });
    Enrolled.aggregate([ 
        { $sort: { _id: 1 } }, 
        { $project: { _id: 1, email: 1, status: 1, course: 1, createdAt: 1 } },
        { $lookup: { from: 'users', localField: 'email', foreignField: 'email', as: 'user' } },
        { $match: { course: new mongoose.Types.ObjectId(id), status: 'ACTIVE'} },
        // { $unwind: '$user' }
    ]).then(result => {
        console.log(result);
        return res.status(200).json({
                    status:true,
                    message: 'Enrolled all User',
            result: result.map((value) => {
                let user = value.user[0];
                let formatedData = {
                    _id: value._id,
                    courseId: value.course,
                    email: value.email,
                    hasAccount: user ? true : false,
                    userId: user?._id,
                    firstname: user?.firstname,
                    lastname: user?.lastname,
                    userStatus: user?.status,
                    status: value.status,
                    createdAt: value.createdAt
                }
                return formatedData;
                    })
                });
    }).catch((error) => {
        console.log('error :>> ', error);
        return res.status(404).json({
            status: false,
            message: 'Enrolled users failed',
        });
    })
})

// GET ALL COURSES BY ENROLLED USER
router.get('/user/:email', (req, res) =>{
    let { email } = req.params;
    if (!email) return res.status(400).json({
        error: 'Missing fields'
    });
    console.log('email :>> ', email);
    Enrolled.find({email, status: 'ACTIVE'}).populate('course').then(result => {
        console.log(result); 
        return res.status(200).json({
                    status:true,
                    message: 'Enrolled all User',
                    result: (result.filter((value) => value.course.status=='ACTIVE')).map((value)=> value.course)
                });
    }).catch((error) => {
        console.log('error :>> ', error);
        return res.status(404).json({
            status: false,
            message: 'Enrolled users failed',
        });
    })
})


module.exports = router