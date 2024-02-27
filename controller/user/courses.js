const express = require('express');
const router = express.Router();
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
        Course.findOne({ _id: id })
        .then((result) => {
            return res.status(201).json({
                status:true,
                message: 'Course single success',
                response: result
            });
        }).catch((error) => {
            return res.status(404).json({
                status: false,
                message: 'Course single failed',
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