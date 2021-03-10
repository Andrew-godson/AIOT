
const express =require('express');
const app = express();
const connectDB=require('./config/db')
app.get('/',(req,res)=>res.send("APP RUNNING SUCCESSFULLY!!!"));
connectDB();
app.use(express.json({extended:false}));
app.use("/api/users",require("./routes/api/users"));
app.use("/api/auth",require("./routes/api/auth"));
app.use("/api/profile",require("./routes/api/profile"));
app.use("/api/post",require("./routes/api/post"));


const PORT=process.env.PORT || 1000;
app.listen(PORT,()=>console.log(`server connected ${PORT}`));