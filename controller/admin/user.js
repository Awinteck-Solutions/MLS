const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
const random = require('random');
const fs = require('fs')

// USER LIST

// USER PROFILE

// ACTIVATE ACCOUNT

// DEACTIVATE ACCOUNT

// DELETE ACCOUNT

// 



module.exports = router