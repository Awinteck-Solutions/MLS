const multer = require('multer')
const express = require('express'); 
const router = express.Router();
const { uploadFile } = require('../../config/s3')
 

const Lesson = require('../../scheme/lessonModel')


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
                Lesson.findOneAndUpdate({_id:lesson_id}, {pdf}, {upsert:true})
                    .then((result) => {
                        return res.status(200).json({
                            status:true,
                            message: 'Lesson update success',
                            response: result
                        });
                    }).catch((error) => {
                        return res.status(404).json({
                            status: false,
                            message: 'Lesson update failed',
                            other: error
                        });
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
                Lesson.findOneAndUpdate({_id:lesson_id}, {video}, {upsert:true})
                .then((result) => {
                    return res.status(200).json({
                        status:true,
                        message: 'Lesson update success',
                        response: result
                    });
                }).catch((error) => {
                    return res.status(404).json({
                        status: false,
                        message: 'Lesson update failed',
                        other: error
                    });
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
        let { course_id, title, desc, authorId } = req.body;

        if (!course_id || !title || !desc || !authorId) {
            res.status(400).json({error: 'Missing fields'})
        }
        try {
            console.log(course_id, 'course_id')
            const lesson = Lesson({
                course:course_id,
                title,
                description: desc,
                author:authorId
            })
            
            lesson.save()
                .then((result) => {
                    return res.status(200).json({
                        status:true,
                        message: 'Lesson saved success',
                        response: result
                    });
                }).catch((error) => {
                    return res.status(404).json({
                        status: false,
                        message: 'Lesson saved failed',
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
  
// -------------------------- UPDATE LESSON
    router.post('/update', (req, res) => {
        let { id, title, desc } = req.body;
            console.log('id, title, desc :>> ', id, title, desc);
        if (!id || !title || !desc) {
            return res.status(400).json({error: 'Missing fields'})
        }

        try {
            Lesson.findOneAndUpdate({_id:id}, {id, title, description:desc}, {upsert:true})
                .then((result) => {
                    return res.status(200).json({
                        status:true,
                        message: 'Lesson update success',
                        response: result
                    });
                }).catch((error) => {
                    return res.status(404).json({
                        status: false,
                        message: 'Lesson update failed',
                        other: error
                    });
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
        Lesson.deleteOne({_id:id})
        .then((result) => {
            return res.status(200).json({
                status:true,
                message: 'Lesson delete success', 
            });
        }).catch((error) => {
            return res.status(404).json({
                status: false,
                message: 'Lesson delete failed',
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

// -------------------------- GET ONE LESSON
    router.get('/:id', (req, res) => {
        let { id } = req.params;
        if (!id) {
            res.status(400).json({error: 'Missing fields'})
        }
      try {
            Lesson.findOne({_id:id})
            .then((result) => {
                return res.status(200).json({
                    status:true,
                    message: 'Lesson success',
                    response: result
                });
            }).catch((error) => {
                return res.status(404).json({
                    status: false,
                    message: 'Lesson failed',
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
  

// --------------------------END LESSON SECTION------------------------------



module.exports = router