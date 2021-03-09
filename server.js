const { response, request } = require('express');
const express = require('express');
const app = express();

app.get('/',(req,res)=>res.send("APP RUNNING!!!"));





const PORT=process.env.PORT || 1000;
app.listen(PORT,()=>console.log(`server connected ${PORT}`));