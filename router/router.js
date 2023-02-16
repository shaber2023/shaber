const express = require('express');
const router = express.Router();
const cors = require('cors');
const bcrypt = require('bcrypt')
const Jwt = require('jsonwebtoken');
const User = require('../model/schema');
const myouth = require('../model/userOuth')
const privateKey = 'mynameisshaber'
require('../db/data');

router.use(express.json());
router.use(cors())

router.use(express.urlencoded({extended:true}))

//varify user

const varifyme=(req,res,next)=>{
    try {
        const token = req.headers.authorization
        if(token){
            const jwttoken = token.split(' ')[1]
             Jwt.verify(jwttoken,privateKey,(err,user)=>{
                if(err){
                    res.status(401).json({message:'token is not valid'})
                }
                req.user=user;
                next();
             })
        }else{
            res.status(401).json({message:'you are not authentacitd shaber'})
        }
    } catch (error) {
        res.status(500).json({message:'this is your server error'})
    }
}

//create user

router.post('/',varifyme,async(req,res)=>{
        try {
        const{name,email}=req.body;
        if(!name || !email ){
            res.json({message:'plz fild the all data'})
        }else{
            const userexist = await User.findOne({email:email})
               if(userexist){
                   res.status(404).json({message:'user alrady exist'})
               }else{
                   const data = new User({name,email});
                    const fulldata = await data.save();
                   res.status(201).json({fulldata})}    
        }
    } catch (error) {
        console.log(error)
    }
})





//update user

router.patch('/:id',varifyme,async(req,res)=>{ 
    try {
        const updatedata = await User.findByIdAndUpdate(req.params.id,req.body,{new:true})
        res.status(200).json({message:'your user is update',updatedata})
    } catch (error) {
        console.log(error);
    }
})



//get all user

router.get('/',varifyme,async(req,res)=>{
   try {
    const alluser =await User.find();
    res.status(200).json({alluser})
   } catch (error) {
    console.log(error)
   }
})


//get one user

router.get('/:id',varifyme,async(req,res)=>{
    try {
        const oneuser = await User.findById(req.params.id,req.body);
        res.status(200).json({message:'this is one document',oneuser})
    } catch (error) {
        console.log(error)
    }
})

//delete user

router.delete('/:id',varifyme,async(req,res)=>{
    try {
        await User.deleteOne({_id : req.params.id})
        res.status(200).json({message:'your user is deleted'})
    } catch (error) {
        console.log(error)
    }
})

//register user

router.post('/register',async(req,res)=>{
    try {
        const{name,email,password}=req.body;
        const mypas = await bcrypt.hash(password,10)
        const mydata = new myouth({name,email,password:mypas})
        const fulldata =await mydata.save();
        const token = Jwt.sign({fulldata:name,fulldata:email},privateKey)
        res.status(201).json({user:fulldata,token:token})
    } catch (error) {
        console.log(error)
    }
})



// //login user

router.post('/login',async(req,res)=>{
    try {
        const{name,email,password}=req.body
        const userexist =await myouth.findOne({email:email})
        if(userexist){
            const maschpassword =await bcrypt.compare(password,userexist.password)
            if(maschpassword){
                const token = Jwt.sign({userexist:name,userexist:email},privateKey);
               return res.status(200).json({user:userexist,token:token})
            }
            res.status(404).json({message:'password invalid'})
        }else{
            return res.status(404).json({message:'user not exist'})
        }
    } catch (error) {
        console.log(error)
    }
})

module.exports=router
