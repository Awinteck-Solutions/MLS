const express = require('express');
const router = express.Router();
const multer = require('multer')
const bodyparser = require('body-parser')
const mongoose = require('mongoose')

const Course = require('../../scheme/courseModel')

const { uploadFile } = require('../../config/s3')

//Set up middlewares
router.use(bodyparser.json());
router.use(bodyparser.urlencoded({ extended: false }));

//Image upload - multer config

const upload = multer({ storage: multer.memoryStorage() })

// --------------------------COURSE SECTION------------------------------
  



router.get('/course/all', (req, res) => {
    try {
        Course.aggregate([ 
            { $sort: { _id: 1 } }, 
            { $lookup: { from: 'enrolls', localField: '_id', foreignField: 'course', as: 'enrolls' } },
            // { $match: { _id: new mongoose.Types.ObjectId(id), status: 'ACTIVE'} },
            {
                $project: {
                    _id: 1, title: 1, description:1, thumbnail:1, link:1,price:1,category:1,archived:1, status: 1, course: 1, createdAt: 1,updatedAt:1,
                    "enrolls": {
                        "$filter": {
                            "input": "$enrolls",
                            "as": "enrolls",
                            "cond": { "$eq": [ "$$enrolls.status", "ACTIVE" ] }
                        }
                     }
                }
            }
            // { $unwind: '$user' }
        ]).then((result) => {
            return res.status(201).json({
                status:true,
                message: 'Course list success',
                response: result.map((value) => {
                    return {
                        ...value,
                        enrolls: value.enrolls.length
                    }
                })
            });
        }).catch((error) => {
            return res.status(404).json({
                status: false,
                message: 'Course list failed',
                other: error
            });
        })
        
    } catch (error) {
        console.log('error :>> ', error);
        res.status(500).json({
            status: false,
            message: "System Error"
        })
    }
})



// -------------------------- ADD COURSE
router.post('/add', upload.single('upload'), async (req, res) => {
    const file = req.file
    const { title,desc,link,price,category,status,authorId } = req.body;
    if (!file || !title || !status || !authorId) return res.status(400).json({
        error: 'Missing fields'
    });
    try {
        let result = await uploadFile(file)
        if (result) {
            let thumbnail = `/res/${result.Key}`
            const course = Course({
                title, description:desc, thumbnail, link, price, category, status,
                author:authorId
            })
            course.save().then((result) => {
                return res.status(201).json({
                    status:true,
                    message: 'New Course added',
                    response: result
                });
            }).catch((error) => {
                return res.status(404).json({
                    status: false,
                    message: 'Course adding failed',
                    other: error
                });
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
        Course.findOneAndUpdate({ _id: id }, { title, description:desc, link, price, category, status }, { upsert: false })
            .then((result) => {
                return res.status(201).json({
                    status:true,
                    message: 'Course update',
                    response: result
                });
            }).catch((error) => {
                return res.status(404).json({
                    status: false,
                    message: 'Course updating failed',
                    other: error
                });
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
            Course.findOneAndUpdate({ _id: id }, { thumbnail }, { upsert: true })
                .then((result) => {
                    console.log('thumbnail :>> ', thumbnail);
                    
                return res.status(201).json({
                    status:true,
                    message: 'Course image update',
                    response: result
                });
            }).catch((error) => {
                return res.status(404).json({
                    status: false,
                    message: 'Course image updating failed',
                    other: error
                });
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
    Course.deleteOne({ _id: id })
    .then((result) => {
        return res.status(201).json({
            status:true,
            message: 'Course delete success'
        });
    }).catch((error) => {
        return res.status(404).json({
            status: false,
            message: 'Course delete failed',
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

// -------------------------- UPDATE STATUS COURSE
router.post('/update/status', (req, res) => {
    let { id,status } = req.body;
    if (!id || !status) {
        res.status(400).json({error: 'Missing fields'})
    }
  try {
    Course.findOneAndUpdate({ _id: id }, { status }, { upsert: false })
    .then((result) => {
        return res.status(201).json({
            status:true,
            message: 'Course status update',
            response: result
        });
    }).catch((error) => {
        return res.status(404).json({
            status: false,
            message: 'Course status updating failed',
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

// -------------------------- UPDATE ARCHIVE COURSE
router.post('/update/achive', (req, res) => {
    let { id,archived } = req.body;
    if (!id || !archived) {
       return res.status(400).json({error: 'Missing fields'})
    }
  try {
    Course.findOneAndUpdate({ _id: id }, { archived }, { upsert: false })
    .then((result) => {
        return res.status(201).json({
            status:true,
            message: 'Course archived update',
            response: result
        });
    }).catch((error) => {
        return res.status(404).json({
            status: false,
            message: 'Course archived updating failed',
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


// --------------------------END COURSE SECTION------------------------------
    



module.exports = router