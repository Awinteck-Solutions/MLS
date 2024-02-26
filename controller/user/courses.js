const express = require('express');
const router = express.Router();
const CourseModel = require('../../models/user/courseModel')
const CourseDB = new CourseModel()

router.get('/all', (req, res) => {
    try {
        CourseDB.getAllCourse((response) => {
            if (response.status) {
                return res.status(200).json({
                    ...response
                })
            } else {
                return res.status(404).json({
                    ...response
                })
            }
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
        CourseDB.getSingleCourse(id,(response) => {
            if (response.status) {
                return res.status(200).json({
                    ...response
                })
            } else {
                return res.status(404).json({
                    ...response
                })
            }
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "System Error"
        })
    }
})


router.get('/user/:id', (req, res) => {
    let { id } = req.params;
    try {
        CourseDB.getUserCourses(id,(response) => {
            if (response.status) {
                return res.status(200).json({
                    ...response
                })
            } else {
                return res.status(404).json({
                    ...response
                })
            }
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "System Error"
        })
    }
})

module.exports = router