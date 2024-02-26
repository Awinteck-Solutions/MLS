const express = require('express')
const cors = require('cors')
// const Admin = require('./controllers/admin')
const Users = require('./controller/user/users')
const bodyParser = require('body-parser')
require('dotenv').config();
const { getFileStream } = require('./config/s3')

const courseController = require('./controller/user/courses')
const lessonController = require('./controller/admin/lesson')
const adminCourseController = require('./controller/admin/course')
const adminController = require('./controller/admin/admin')
const feedbackController = require('./controller/admin/feedback')

const PORT = process.env.PORT || 1000;
const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.set('json spaces', 5); // to pretify json response

app.use('/course', courseController)
app.use('/lesson', lessonController)
app.use('/course', adminCourseController)
app.use('/admin', adminController)
app.use('/feedback', feedbackController)

app.use(cors({
    origin: '*'
}));
app.use('/user', Users)
// app.use('/admin', Admin)

app.get('/', (req,res)=>{
    res.send('welcome to MSL Business')
})


    
// -------------------------- GET LESSON IMAGES
    
app.get('/api/res/:key', (req, res) => {
    console.log(req.params)
    const key = req.params.key
    const readStream = getFileStream(key)
    readStream.pipe(res)
})




app.listen(PORT, ()=> console.log('Listening at: ',PORT))