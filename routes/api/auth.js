const { json, Router } = require("express");
const express=require("express");
const router=express.Router();
const {check,validationResult}=require("express-validator");
const bcrypt=require("bcryptjs")
const jwt=require('jsonwebtoken');
const config=require('config');
const auth=require("../../middleware/auth");
const User=require("../../models/Users");


 router.get('/',auth,async(req,res)=>{
    try{
        const user=await User.findById(req.user.id).select("-password");
        res.json(user);
    }
    catch(err){
        console.log(err);
        res.status(404).send("Server Error!!!");
    }
});
router.post('/',[
   
    check("email","Enter a vaild email ID").isEmail(),
    check("password","Incorrect password").exists()
    
    ],
    async(req,res)=>{
        const{email,password}=req.body;
        const errors=validationResult(req);
        if (!errors.isEmpty())
        {
            return res.status(400).json({errors:errors.array()})
        }
        try{
            //CHECK IF USER EXSISTS:
            let user= await User.findOne({email});
            if(!user){
                return res.status(404).json({msg:"Invalid Credential's"})
            }

            const isMatch=await bcrypt.compare(password,user.password);
            if(!isMatch){
                res.status(404)
                .json({errors:[{msg:"Invalid credentials"}]})
            }
            const newuser=new User({
                email,password
            });
            // JSONWEBTOKEN
            const payload={
            user:{
                id:newuser.id
            }
            }
            jwt.sign(
                payload,
                config.get('jwtToken'),
                {expiresIn:3600},
                (err,token)=>{
                    if(err) throw err;
                    res.json({token})
                }
    
            )
    
    
            
        }
        catch(err){
    console.error(err);
    res.status(500).send("Server Not Responding");
        }
        
        
    });
module.exports= router;