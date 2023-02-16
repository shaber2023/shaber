const mongoose = require('mongoose');
const myschema = new mongoose.Schema({
    name : {type : String},
    email : {type : String},
});

module.exports=mongoose.model('MyData',myschema)