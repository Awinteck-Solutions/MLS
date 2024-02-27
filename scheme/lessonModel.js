const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const lessonSchema = new Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    video: String,
    pdf: String,
    status: {
        type: String,
        enum : ['ACTIVE','DEACTIVE'],
        default: 'DEACTIVE',
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    }
},  {timestamps: true})

const Lesson = mongoose.model('Lesson', lessonSchema);
module.exports = Lesson