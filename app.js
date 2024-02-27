const express = require('express')
const cors = require('cors')
const ip = require('ip')
// const Admin = require('./controllers/admin')
const Users = require('./controller/user/users')
const bodyParser = require('body-parser')
require('dotenv').config();
const { getFileStream } = require('./config/s3')
const mongoose = require('mongoose')



const courseController = require('./controller/user/courses')
const lessonController = require('./controller/admin/lesson')
const adminCourseController = require('./controller/admin/course')
const adminController = require('./controller/admin/admin')
const feedbackController = require('./controller/admin/feedback')
const categoryController = require('./controller/admin/category')

const PORT = process.env.PORT || 4000;
const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.set('json spaces', 5); // to pretify json response

app.use('/course', courseController)
app.use('/lesson', lessonController)
app.use('/course', adminCourseController)
app.use('/admin', adminController)
app.use('/feedback', feedbackController)
app.use('/category', categoryController)

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



const mongodbUrl = 'mongodb+srv://awinsamp:cyRn93DPWqk8fT9M@clustertaxlaw.8zsifld.mongodb.net/taxlawgh?retryWrites=true&w=majority&appName=ClusterTaxLaw';
mongoose.connect(mongodbUrl)
    .then((result) => {
        console.log('Database(mongoDB) connection successful');
        app.listen(PORT, ()=> console.log('Listening at: ',`http://${ip.address()}:${PORT}`))
    })
    .catch((error) => console.log('error :>> ', error));