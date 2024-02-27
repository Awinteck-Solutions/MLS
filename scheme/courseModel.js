const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    thumbnail: String,
    link: String,
    price: String,
    category: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum : ['ACTIVE','DEACTIVE'],
        default: 'ACTIVE',
    },
    archived: {
        type: Boolean,
        enum : [true,false],
        default: false,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    }
},  {timestamps: true})

const Course = mongoose.model('Course', courseSchema);
module.exports = Course