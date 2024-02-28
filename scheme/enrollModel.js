const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const enrollSchema = new Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    },
    email: {
        type: mongoose.Schema.Types.String,
        ref: 'User'
    },
    // email: String,
    status: {
        type: String,
        enum : ['ACTIVE','DEACTIVE'],
        default: 'ACTIVE',
    },
},  {timestamps: true})

const Enroll = mongoose.model('Enroll', enrollSchema);
module.exports = Enroll