const express = require('express');
const router = express.Router();
const multer = require('multer')
const bodyparser = require('body-parser')
const nodemailer = require('nodemailer'); 

const { uploadFile, getFileStream } = require('../../config/s3')

const courseModel = require('../../models/admin/courseModel')
const CourseDB = new courseModel()
//Set up middlewares
router.use(bodyparser.json());
router.use(bodyparser.urlencoded({ extended: false }));

//Image upload - multer config
var timestamp = new Date().getMilliseconds() 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/users/images/')
    },
    filename: function (req, file, cb) {
      cb(null, "course_"+timestamp+'_'+file.originalname)
    }
})
const upload = multer({ storage: multer.memoryStorage() })

// --------------------------COURSE SECTION------------------------------
  

// -------------------------- ADD COURSE
router.post('/add', upload.single('upload'), async (req, res) => {
    const file = req.file
    const { title,desc,link,price,category,status } = req.body;
    if (!file || !title || !status) return res.status(400).json({
        error: 'Missing fields'
    });
    try {
        let result = await uploadFile(file)
        if (result) {
            let thumbnail = `/res/${result.Key}`
            CourseDB.addCourse(title,desc,thumbnail,link,price,category,status,(response) => {
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
        } else {
            res.status(400).json({
                status: false,
                message: "course (image) upload failed"
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

// -------------------------- UPDATE COURSE
    
router.post('/update', async (req, res) => {
    const { id,title,desc,link,price,category,status } = req.body;

    if (!id || !title || !status) return res.status(400).json({
        error: 'Missing fields'
    });

    try { 
        CourseDB.updateCourse(id,title,desc,link,price,category,status,(response) => {
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
        console.log('error :>> ', error);
        res.status(500).json({
            status: false,
            message: "System Error"
        })
    }
})

// -------------------------- UPDATE COURSE THUMBNAIL
router.post('/update/thumbnail', upload.single('upload'), async (req, res)=>{
    var { id } = req.body;
    const file = req.file

    if (!file || !id) return res.status(400).json({
        error: 'Missing fields'
    });

    try {
        let result = await uploadFile(file)
        if (result) {
            let thumbnail = `/res/${result.Key}`
            CourseDB.updateCourseThumbnail(id, thumbnail, (response)=>{
                if(response.status ==true){
                    res.status(201).json({
                        status: true,
                        message: response.message,
                    });
                    return;
                }else{
                    res.status(404).json({
                        status: false,
                        message: response.message
                    });
                    return;
                }
            }) 
        }
    }
    catch (e){
        res.status(500).json({
            status: false,
            message: "System Error"
        })
        }
    })


// -------------------------- DELETE COURSE
  
router.get('/delete/:id', (req, res) => {
    let { id } = req.params;
    if (!id) {
        res.status(400).json({error: 'Missing fields'})
    }
  try {
      CourseDB.deleteCourse(id,(response) => {
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

// -------------------------- UPDATE STATUS COURSE
router.post('/update/status', (req, res) => {
    let { id,status } = req.body;
    if (!id || !status) {
        res.status(400).json({error: 'Missing fields'})
    }
  try {
      CourseDB.updateStatus(id,status, (response) => {
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


// --------------------------END COURSE SECTION------------------------------
    



module.exports = router