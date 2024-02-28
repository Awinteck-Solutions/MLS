const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const lessonSchema = new Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {type: String, default: null},
    video: {type: String, default: null},
    pdf: {type: String, default: null},
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