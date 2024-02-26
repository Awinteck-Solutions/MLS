const express = require('express');
const router = express.Router();
const feedbackModel = require('../../models/admin/feedBackModel')
const FeedbackDB = new feedbackModel()

// -------------------------- GET ALL FEEDBACK
router.get('/all', (req, res) => {
  try {
    FeedbackDB.getAll((response) => {
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

// -------------------------- READ FEEDBACK
router.get('/:id', (req, res) => {
    let { id } = req.params;
    if (!id) {
        res.status(400).json({error: 'Missing fields'})
    }
  try {
    FeedbackDB.getSingle(id,(response) => {
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

// -------------------------- ADD FEEDBACKS
router.post('/add', (req, res) => {
    let { type,user_id,phone,message } = req.body;
    if (!type || !user_id || !phone || !message) {
        res.status(400).json({error: 'Missing fields'})
    }
  try {
    FeedbackDB.add(type,user_id,phone,message,(response) => {
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

// -------------------------- DELETE FEEDBACKS
router.get('/delete/:id', (req, res) => {
    let { id } = req.params;
    if (!id) {
        res.status(400).json({error: 'Missing fields'})
    }
  try {
    FeedbackDB.deleteFeedback(id,(response) => {
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

// -------------------------- UPDATE FEEDBACKS
router.post('/update-status', (req, res) => {
    let { id,status } = req.body;
    if (!id || !status) {
        res.status(400).json({error: 'Missing fields'})
    }
  try {
    FeedbackDB.updateStatusFeedback(id,status,(response) => {
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