const jwt=require("jsonwebtoken");
const config=require("config");
module.exports=(req,res,next)=>{
const token=req.header('x-auth-token');
if(!token){
    return res.status(401).json({msg:"NO token,Access Denied"})
};
try{
const decoded=jwt.verify(token,config.get('jwtToken'));
req.user=decoded.user;
next();
}
catch(err){
    res.status(400).json({msg:"Invalid Token"});
}
}