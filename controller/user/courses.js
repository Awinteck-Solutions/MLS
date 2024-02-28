const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const Course = require('../../scheme/courseModel')
const Enrolled = require('../../scheme/enrollModel')


router.get('/all', (req, res) => {
    try {
        Course.find({status:"ACTIVE"})
        .then((result) => {
            return res.status(201).json({
                status:true,
                message: 'Course list success',
                response: result
            });
        }).catch((error) => {
            return res.status(404).json({
                status: false,
                message: 'Course list failed',
                other: error
            });
        })
        
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "System Error"
        })
    }
})



router.get('/single/:id', (req, res) => {
    let { id } = req.params;
    try {
        Course.aggregate([ 
            { $sort: { _id: 1 } }, 
            { $lookup: { from: 'lessons', localField: '_id', foreignField: 'course', as: 'lessons' } },
            { $match: { _id: new mongoose.Types.ObjectId(id), status: 'ACTIVE'} },
            {
                $project: {
                    _id: 1, title: 1, status: 1, course: 1, createdAt: 1,
                    "lessons": {
                        "$filter": {
                            "input": "$lessons",
                            "as": "lessons",
                            "cond": { "$eq": [ "$$lessons.status", "ACTIVE" ] }
                        }
                     }
                }
            }
            // { $unwind: '$user' }
        ])
            .then((result) => {
                console.log('result :>> ', result);
                if (result.length > 0) { 
                    return res.status(201).json({
                        status:true,
                        message: 'Course single success',
                        response: result[0]
                    });
                } else {
                    return res.status(404).json({
                        status:false,
                        message: 'Course not found'
                    });
                }
        }).catch((error) => {
            console.log('error :>> ', error);
            return res.status(404).json({
                status: false,
                message: 'Course single failed',
                other: error
            });
        })
    } catch (error) {
        console.log('error :>> ', error);
        res.status(500).json({
            status: false,
            message: "System Error"
        })
    }
})


router.get('/user/:email', (req, res) => {
    let { email } = req.params;
    try { 
        Enrolled.find({ email })
        .then((result) => {
            return res.status(201).json({
                status:true,
                message: 'My Courses',
                response: result
            });
        }).catch((error) => {
            return res.status(404).json({
                status: false,
                message: 'Courses failed',
                other: error
            });
        })

    } catch (error) {
        res.status(500).json({
            status: false,
            message: "System Error"
        })
    }
})

module.exports = router