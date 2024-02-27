const express = require('express');
const router = express.Router();


const Category = require('../../scheme/categoryModel')


// ADD CATEGORY
router.post('/add', (req, res) => {
    // get values in request
    let {name, adminId}  = req.body;


    if (!name || !adminId ) return res.status(400).json({
        error: 'Missing fields'
    });

    // Register new user 
    const category = Category({
        name,
        author:adminId
    })
    category.save().then((result) => {
        return res.status(201).json({
            status:true,
            message: 'New category added',
            response: result
        });
    }).catch((error) => {
        return res.status(404).json({
            status: false,
            message: 'category adding failed',
            other: error
        });
    })

});

// DELETE CATEGORY

router.get('/delete/:id', (req, res) => {
    // get values in request
    let {id}  = req.params;

    if (!id ) return res.status(400).json({
        error: 'Missing fields'
    });
    

    Category.deleteOne({_id:id}).then((result) => {
        return res.status(201).json({
            status:true,
            message: 'delete category success'
        });
    }).catch((error) => {
        return res.status(404).json({
            status: false,
            message: 'delete category failed'
        });
    })

});

// GET  ONE CATEGORY
router.get('/single/:id', (req, res) => {
    // get values in request
    let {id}  = req.params;

    if (!id ) return res.status(400).json({
        error: 'Missing fields'
    });
    
    Category.findOne({ _id: id }).then((result) => {
        console.log('result :>> ', result);
        if (result) {
            return res.status(200).json({
                status: true,
                message: 'category success',
                response: result
            });
        } else {
            return res.status(404).json({
                status: true,
                message: 'categoryId not found'
            });
        }
    }).catch((error) => {
        return res.status(400).json({
            status: false,
            message: 'category failed',
            other: error
        });
    })

});


// GET ALL CATEGORY
router.get('/all', (req, res) => {

    Category.find().then((result) => {
        console.log('result :>> ', result);
        return res.status(200).json({
            status:true,
            message: 'category success',
            response: result
        });
    }).catch((error) => {
        console.log('result :>> ', error);
        return res.status(404).json({
            status: false,
            message: 'category failed',
            other: error
        });
    })

});


module.exports = router