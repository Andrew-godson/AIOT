const express=require("express");
const router=express.Router();
const {check,validationResult}=require("express-validator");
const User=require("../../models/Users");
const grav=require('gravatar');
const bycrpt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const config=require('config');

router.post('/',[
check("name","Enter Your Name").not().isEmpty(),
check("email","Enter a vaild email ID").isEmail(),
check("password","Password is short,Minimum of 6 Characters").isLength({min:6})

],
async(req,res)=>{
    const{name,email,password}=req.body;
    const errors=validationResult(req);
    if (!errors.isEmpty())
    {
        return res.status(400).json({errors:errors.array()})
    }
    try{
        //CHECK IF USER EXSISTS:
        let user= await User.findOne({email});
        if(user){
            return res.status(404).json({msg:"User EXSIST'S"})
        }
       // GRAVATAR
        const avatar=grav.url(email,{
            s:"200",
            r:'pg',
            d:'mm'

        });
        // ECRYPTING THE PASSWORD
        const newuser=new User({
            name,email,avatar,password
        });
        const salt=await bycrpt.genSalt(10);
        newuser.password=await bycrpt.hash(password,salt);
        await newuser.save();
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

module.exports=router;