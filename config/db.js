const mongoose=require('mongoose');
const config=require('config'); 
const db= config.get('mongoURI')

const connectDB=async()=>{
    try{
         await mongoose.connect(db,{
            
            useNewUrlParser: true ,
            useUnifiedTopology: true,
            useCreateIndex:true,
         });
         console.log("Database connected!!!");
    }
    catch{
        console.log("just some error");
    }
}

module.exports=connectDB;