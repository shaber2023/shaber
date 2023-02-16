const mongoose = require('mongoose');
require('dotenv').config({path:'./.env'})
mongoose.set("strictQuery", false);
const db = process.env.DATABASE

mongoose.connect(db)
.then(()=>{console.log('your connection is successful')})
.catch((err)=>{console.log(err)})