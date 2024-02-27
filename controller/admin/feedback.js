const express = require('express');
const router = express.Router();

const Feedback = require('../../scheme/feedbackModel')

// -------------------------- GET ALL FEEDBACK
router.get('/all', (req, res) => {
    try {
        Feedback.find()
        .then((result) => {
            return res.status(200).json({
                status:true,
                message: 'Feedback success',
                response: result
            });
        }).catch((error) => {
            return res.status(404).json({
                status: false,
                message: 'Feedback failed',
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

// -------------------------- READ FEEDBACK
router.get('/:id', (req, res) => {
    let { id } = req.params;
    if (!id) {
        res.status(400).json({error: 'Missing fields'})
    }
  try {
        Feedback.findOne({ _id: id })
        .then((result) => {
            return res.status(201).json({
                status:true,
                message: 'Feedback success',
                response: result
            });
        }).catch((error) => {
            return res.status(404).json({
                status: false,
                message: 'Feedback failed',
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

// -------------------------- ADD FEEDBACKS
router.post('/add', (req, res) => {
    let { type,user_id,phone,message } = req.body;
    if (!type || !user_id || !phone || !message) {
        res.status(400).json({error: 'Missing fields'})
    }
    try {
        const feedback = Feedback({
            type,phone,message, user:user_id
        })
        feedback.save()
        .then((result) => {
            return res.status(201).json({
                status:true,
                message: 'Feedback success',
                response: result
            });
        }).catch((error) => {
            return res.status(404).json({
                status: false,
                message: 'Feedback failed',
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

// -------------------------- DELETE FEEDBACKS
router.get('/delete/:id', (req, res) => {
    let { id } = req.params;
    if (!id) {
        res.status(400).json({error: 'Missing fields'})
    }
  try {
    Feedback.deleteOne({ _id: id })
    .then((result) => {
        return res.status(201).json({
            status:true,
            message: 'Feedback delete success',
            response: result
        });
    }).catch((error) => {
        return res.status(404).json({
            status: false,
            message: 'Feedback delete failed',
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

// -------------------------- UPDATE FEEDBACKS
router.post('/update-status', (req, res) => {
    let { id,status } = req.body;
    if (!id || !status) {
        res.status(400).json({error: 'Missing fields'})
    }
    try {
        Feedback.findOneAndUpdate({ _id: id },{status},{upsert: false})
    .then((result) => {
        return res.status(201).json({
            status:true,
            message: 'Feedback status success',
            response: result
        });
    }).catch((error) => {
        return res.status(404).json({
            status: false,
            message: 'Feedback status failed',
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