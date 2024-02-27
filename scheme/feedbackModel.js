const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const feedbackSchema = new Schema({
    type: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    phone: String,
    message: String,
    status: {
        type: String,
        enum : ['ACTIVE','DEACTIVE'],
        default: 'ACTIVE',
    },
},  {timestamps: true})

const Feedback = mongoose.model('Feedback', feedbackSchema);
module.exports = Feedback