const express = require('express')
const router = express.Router()

const Requests = require('../../scheme/requestModel')


// =======================GET REQUESTS=======================
router.get('/all', (req, res) => {
    Requests.find()
    .then((result) => {
        return res.status(201).json({
            status:true,
            message: 'Request success', 
            response:result
        });
    }).catch((error) => {
        return res.status(404).json({
            status: false,
            message: 'Request failed',
            other: error
        });
    })
})


// =======================TOGGLE REQUEST=======================
router.get('/toggle/:id/:status', (req, res) => {
    let { id, status} = req.params;
    if (!id || !status) {
        return res.status(401).json({
            status: false,
            message:"Missing fields"
        })
    }
    Requests.updateOne({ _id: id }, {status}, {upsert:false})
    .then((result) => {
        return res.status(201).json({
            status:true,
            message: 'request success'
        });
    }).catch((error) => {
        return res.status(404).json({
            status: false,
            message: 'Request failed'
        });
    })
})


// =======================REQUEST DELETE=======================
router.get('/delete/:id', (req, res) => {
    let { id } = req.params;
    if (!id) {
        return res.status(401).json({
            status: false,
            message:"Missing field"
        })
    }
    Requests.deleteOne({_id:id})
    .then((result) => {
        return res.status(201).json({
            status:true,
            message: 'Request delete success', 
            response:result
        });
    }).catch((error) => {
        return res.status(404).json({
            status: false,
            message: 'Request delete failed',
            other: error
        });
    })
})

// =======================POST REQUEST=======================
router.post('/add', (req, res) => {
let { email, courseId } = req.body;
if (!email && !courseId) {
    return res.status(401).json({
        status: false,
        message:"missing fields"
    })
}

    const requests = Requests({email, course:courseId})
    requests.save().then((result) => {
    return res.status(201).json({
        status:true,
        message: 'Request saved success', 
    });
}).catch((error) => {
    return res.status(404).json({
        status: false,
        message: 'Request failed',
        other: error
    });
})
})
    

module.exports = router