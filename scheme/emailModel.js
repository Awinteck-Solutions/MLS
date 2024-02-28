const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const emailSchema = new Schema({
    recipients: { type: Array, required: true },
    subject: { type: String, required: true},
    body: { type: String, required: true },
    status: {
        type: String,
        enum : ['SENT','FAILED','PENDING'],
        default: 'PENDING',
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    },
    failedEmails: Array
},  {timestamps: true})

const Email = mongoose.model('Email', emailSchema);
module.exports = Email