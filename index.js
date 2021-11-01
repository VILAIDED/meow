const express = require('express');
const helmet = require('helmet');
const path = require("path")
const multer = require('multer')
const morgan = require('morgan')
const app = express();
const mongoose = require('mongoose')
const authRoute = require("./routes/auth")
const postRoute = require("./routes/post")
const userRoute = require("./routes/users")
require('dotenv').config()
try{
    const con = mongoose.connect(process.env.MONGOOSE_URL,()=>{
        console.log("connect to mongoose")
    })
    
}catch(err){
    console.log(err)
}

const _dirname = path.resolve(path.dirname(''));
console.log(path.join(_dirname,"images"))
app.use('/images',express.static(path.join(_dirname,"images")))
app.use(express.json());
app.use(helmet());
app.use(morgan("common"))
const storage = multer.diskStorage({
    destination : (req,file,cb)=>{
        cb(null,"public/image");
    },
    filename : (req,file,cb)=>{
        cb(null,req.body.name)
    }
})

const upload = multer({storage : storage});

app.post("/api/upload",upload.single("file"),(req,res)=>{
    try{
        return res.status(200).json("Uploaded file");
    }catch(err){
        console.log(err);
    }
})
app.use("/api/auth",authRoute)
app.use("/api/posts",postRoute)
app.use("/api/user",userRoute)
app.get('/',(req,res)=>{
    res.send("Hello world");
    console.log('meow meow')
})
app.listen(5000,()=>{
    console.log("server is running");
})