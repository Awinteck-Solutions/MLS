const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const emailSchema = new Schema({
    email: { type: String, required: true },
    message: String,
    status: {
        type: String,
        enum : ['SENT','FAILED','PENDING'],
        default: 'PENDING',
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    }
},  {timestamps: true})

const Email = mongoose.model('Email', emailSchema);
module.exports = Email