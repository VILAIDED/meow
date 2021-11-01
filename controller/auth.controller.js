const User = require("../models/User")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");
const register = async (req,res) =>{
        try{
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password,salt);
            const newUser = new User({
                username : req.body.username,
                email : req.body.email,
                password : hashedPassword
            })
            console.log(hashedPassword)
            const user = await newUser.save();
            res.status(200).json(user)
        }catch(err){
            console.log(err)
            res.status(500).json(err)
        }
}
const signin = async(req,res)=>{
    try{
        const user  = await User.findOne({
            "email" : req.body.email
        })
        if(!user)
        return res.status(401).json({
            error : "User not found"
        })
        if(!(await bcrypt.compare(req.body.password,user.password))) return res.status(401).json({message : "email or password is valid"})
       
        const token = await jwt.sign({
            user : user,
        }, process.env.TOKEN_SECRET)
        console.log(token)
        req.header('auth-token',token);
        res.status(200).json(token);
    }catch(err){
        res.status(500).json({message : err})
    }
}
const verifyToken = (req,res,next) =>{
    const token = req.header('auth-token');
    if(!token){
        return res.status(403).send("a token is not exist");
    }
    try{
        const decoded = jwt.verify(token,process.env.TOKEN_SECRET);
    //    req.user = decoded.user 
        req.body.userId = decoded.user._id
        
    }catch(err){
        return res.status(401).send(err)
    }
    return next();
}
const logined = async(req,res)=>{
    try{

    
    const userId = req.body.userId;
    const user = await User.findOne({_id : userId})
    res.status(200).json(user);
    }catch(err){
        res.status(500).json(err);
    }

}
module.exports = {
    verifyToken,
    signin,
    register,
    logined
}