const mongoose = require('mongoose');
const myouth =new mongoose.Schema({
    name : String,
    email : String,
    password : String
});

module.exports=mongoose.model('myouth',myouth)