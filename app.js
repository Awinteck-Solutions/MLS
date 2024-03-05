const express = require('express')
const cors = require('cors')
const ip = require('ip')
// const Admin = require('./controllers/admin')
const bodyParser = require('body-parser')
require('dotenv').config();
const { getFileStream } = require('./config/s3')
const mongoose = require('mongoose')



const Users = require('./controller/user/users')
const courseController = require('./controller/user/courses')
const lessonController = require('./controller/admin/lesson')
const adminCourseController = require('./controller/admin/course')
const adminController = require('./controller/admin/admin')
const feedbackController = require('./controller/admin/feedback')
const categoryController = require('./controller/admin/category')
const enrollController = require('./controller/admin/enrolment')
const adminUsersController = require('./controller/admin/user')
const emailController = require('./controller/admin/email')
const requestsController = require('./controller/admin/requests')

const PORT = process.env.PORT || 4000;
const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.set('json spaces', 5); // to pretify json response

app.use('/course', courseController)
app.use('/lesson', lessonController)
app.use('/course', adminCourseController)
app.use('/admin', adminController)
app.use('/admin/users', adminUsersController)
app.use('/feedback', feedbackController)
app.use('/category', categoryController)
app.use('/enroll', enrollController)
app.use('/email', emailController)
app.use('/user', Users)
app.use('/request', requestsController)

app.use(cors({
    origin: '*'
}));

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



const mongodbUrl = 'mongodb+srv://awinsamp:cyRn93DPWqk8fT9M@clustertaxlaw.8zsifld.mongodb.net/taxlawgh?retryWrites=true&w=majority&appName=ClusterTaxLaw';
mongoose.connect(mongodbUrl)
    .then((result) => {
        console.log('Database(mongoDB) connection successful');
        app.listen(PORT, ()=> console.log('Listening at: ',`http://${ip.address()}:${PORT}`))
    })
    .catch((error) => console.log('error :>> ', error));