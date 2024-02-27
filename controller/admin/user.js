const express = require('express');
const router = express.Router();

const User = require('../../scheme/userModel')


// USER LIST
router.get('/all', async (req, res) => {
    try {
        User.find()
            .then((result) => {
                return res.status(200).json({
                    status:true,
                    message: 'Users success',
                    response: result
                });
            }).catch((error) => {
                return res.status(404).json({
                    status: false,
                    message: 'Users failed',
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
// USER PROFILE
router.get('/single/:id', async (req, res) => {
    let userID = req.params.id;
    if (!userID) {
        res.status(400).json({error: 'Missing fields'})
    }
    try {
        User.findOne({_id:userID})
            .then((result) => {
                return res.status(200).json({
                    status:true,
                    message: 'Users success',
                    response: result
                });
            }).catch((error) => {
                return res.status(404).json({
                    status: false,
                    message: 'Users failed',
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

// TOOGLE ACTIVATE ACCOUNT
router.post('/update/status/', async (req, res) => {
    let {status, id} = req.body;
    if (!id || !status) {
        res.status(400).json({error: 'Missing fields'})
    }
    try {
        User.updateOne({_id:id},{status}, {upsert:false})
            .then((result) => {
                return res.status(200).json({
                    status:true,
                    message: 'User status update success',
                    response: result
                });
            }).catch((error) => {
                return res.status(404).json({
                    status: false,
                    message: 'User status update failed',
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

// DELETE ACCOUNT
router.get('/delete/:id', async (req, res) => {
    let {id} = req.params;
    if (!id) {
        res.status(400).json({error: 'Missing fields'})
    }
    try {
        User.deleteOne({_id:id})
            .then((result) => {
                return res.status(200).json({
                    status:true,
                    message: 'User delete success',
                    response: result
                });
            }).catch((error) => {
                return res.status(404).json({
                    status: false,
                    message: 'User delete failed',
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
// 



module.exports = router