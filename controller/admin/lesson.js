const multer = require('multer')
const express = require('express'); 
const router = express.Router();
const lessonModel = require('../../models/admin/lessonModel')
const LessonDB = new lessonModel()
const { uploadFile } = require('../../config/s3')
var { getRandomInt } = require('../../config/helpers')
 
require('dotenv').config()
//Image upload - multer config
var timestamp = new Date().getMilliseconds() 
  
const upload = multer({ storage: multer.memoryStorage() })


// --------------------------LESSON SECTION------------------------------

router.post('/upload', upload.single('upload'), async (req, res) => {
    const file = req.file
    const { lesson_id } = req.body;

    if (!file || !lesson_id ) return res.status(400).json({
        error: 'Missing fields'
    });
    try {
        const result = await uploadFile(file)
        if (result) {
            let pdf = `/res/${result.Key}`
            console.log('result', result)
            res.status(201).json({
                status: true,
                pdf,
                message: "upload success"
            })
        } else {
            console.log('result null')
            res.status(400).json({
                status: false,
                message: "PDF upload failed"
            })
        }
    } catch (error) {
        console.log('error :>> ', error);
        res.status(500).json({
            status: false,
            message: "System Error"
        })
    }
})

// -------------------------- ADD PDF LESSON

    router.post('/add-pdf', upload.single('upload'), async (req, res) => {
        const file = req.file
        const { lesson_id } = req.body;

        if (!file || !lesson_id ) return res.status(400).json({
            error: 'Missing fields'
        });
        try {
            const result = await uploadFile(file)
            if (result) {
                let pdf = `/res/${result.Key}`
                console.log('result', result)
                LessonDB.updateLessonPdf(lesson_id,pdf,(response) => {
                    if (response.status) {
                        return res.status(200).json({
                            ...response,
                            pdf
                        })
                    } else {
                        return res.status(404).json({
                            ...response
                        })
                    }
                }) 
            } else {
                console.log('result null')
                res.status(400).json({
                    status: false,
                    message: "PDF upload failed"
                })
            }
        } catch (error) {
            console.log('error :>> ', error);
            res.status(500).json({
                status: false,
                message: "System Error"
            })
        }
    })
    router.post('/add-pdf1', upload.single('upload'), async (req, res) => {
        const file = req.file
        const { lesson_id } = req.body;

        if (!file || !lesson_id ) return res.status(400).json({
            error: 'Missing fields'
        });
        try {
             await uploadFile(file)
                .then((result) => {
                    let pdf = `/res/${result.Key}`
                    console.log('result', result)
                    LessonDB.updateLessonPdf(lesson_id,pdf,(response) => {
                        if (response.status) {
                            return res.status(200).json({
                                ...response,
                                pdf
                            })
                        } else {
                            return res.status(404).json({
                                ...response
                            })
                        }
                    }) 
                }).catch((error) => {
                    console.log('result null',error)
                    res.status(400).json({
                        status: false,
                        message: "PDF upload failed"
                    })
            })
           
        } catch (error) {
            console.log('error :>> ', error);
            res.status(500).json({
                status: false,
                message: "System Error"
            })
        }
    })
// -------------------------- ADD VIDEO LESSON
    
    router.post('/add-video', upload.single('upload'), async (req, res) => {
        const file = req.file
        const { lesson_id } = req.body;

        if (!file || !lesson_id ) return res.status(400).json({
            error: 'Missing fields'
        });
        try {
            const result = await uploadFile(file)
            if (result) {
                let video = `/res/${result.Key}`
                console.log('result', result)
                LessonDB.updateLessonVideo(lesson_id,video,(response) => {
                    if (response.status) {
                        return res.status(200).json({
                          ...response,video
                        })
                    } else {
                        return res.status(404).json({
                            ...response
                        })
                    }
                })
            } else {
                console.log('result null')
                res.status(400).json({
                    status: false,
                    message: "Video upload failed"
                })
            }
        } catch (error) {
            res.status(500).json({
                status: false,
                message: "System Error"
            })
        }
    })
// -------------------------- ADD LESSON
    
    router.post('/add', async (req, res) => {
        let { course_id, title, desc } = req.body;

        if (!course_id || !title || !desc) {
            res.status(400).json({error: 'Missing fields'})
        }
        try {
            var _id = getRandomInt(999, 9999);

            console.log(course_id,'course_id')
            
            LessonDB.addLesson(_id,title,desc,course_id,(response) => {
                if (response.status) {
                    return res.status(200).json({
                    ...response,
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
  
// -------------------------- UPDATE LESSON
    router.post('/update', (req, res) => {
        let { id, title, desc } = req.body;
            console.log('id, title, desc :>> ', id, title, desc);
        if (!id || !title || !desc) {
            return res.status(400).json({error: 'Missing fields'})
        }

        try {
            LessonDB.updateLesson(id,title,desc,(response) => {
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
           return res.status(500).json({
                status: false,
                message: "System Error"
            })
        }
    })
  
// -------------------------- DELETE LESSON
    router.get('/delete/:id', (req, res) => {
        let { id } = req.params;
        if (!id) {
            res.status(400).json({error: 'Missing fields'})
        }
      try {
          LessonDB.deleteLesson(id,(response) => {
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

// -------------------------- UPDATE PDF
    router.get('/:id', (req, res) => {
        let { id } = req.params;
        if (!id) {
            res.status(400).json({error: 'Missing fields'})
        }
      try {
          LessonDB.getSingleLesson(id,(response) => {
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
  

// --------------------------END LESSON SECTION------------------------------



module.exports = router