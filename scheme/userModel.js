const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const userSchema = new Schema({
    email: { type: String, required: true, unique: true, index: true},
    password: { type: String, required: true },
    firstname: {type: String, default: null},
    lastname: {type: String, default: null},
    image: {type: String, default: null},
    otp: { type: String, required: true },
    status: {
        type: String,
        enum : ['ACTIVE','DEACTIVE'],
        default: 'ACTIVE',
    },
},  {timestamps: true})

const User = mongoose.model('User', userSchema);
module.exports = User