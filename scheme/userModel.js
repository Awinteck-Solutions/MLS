const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const userSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    firstname: String,
    lastname: String,
    image: String,
    otp: { type: String, required: true },
    status: {
        type: String,
        enum : ['ACTIVE','DEACTIVE'],
        default: 'ACTIVE',
    },
},  {timestamps: true})

const User = mongoose.model('User', userSchema);
module.exports = User