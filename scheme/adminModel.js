const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const adminSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    status: {
        type: String,
        enum : ['ACTIVE','DEACTIVE'],
        default: 'ACTIVE',
    },
},  {timestamps: true})

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin