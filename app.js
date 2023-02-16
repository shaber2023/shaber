const express = require('express');
const router = require('./router/router')
const app = express();

app.use('/api/users',router)

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/./views/index.html')
})

module.exports=app