const User = require("../models/User")
const bcrypt = require("bcrypt");

const updatePro = async (req,res) =>{
    if(req.body.userId === req.params.id){
        if(req.body.password){
            try{
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password,salt);
            }catch(err){
                return res.status(500).json(err)
            }
        }
        try{
            const user = await User.findByIdAndUpdate(req.params.id,{
                $set : req.body
            })
            res.status(200).json(user)
        }catch(err){
            return res.status(500).json(err)
        }
    }else{
        return res.status(403).json("You can update only your account!");
    }
}

const getUser = async(req,res)=>{
    const userId = req.query.userId;
    const userName = req.query.username;
    console.log(userName);
    try{
        const user = userId ?
        await User.findById(userId)
        : await User.findOne({username : userName})
        const {password,updateAt,...other} = user._doc;
        console.log(other);
        return res.status(200).json(other);
    }catch(err){
        return res.status(500).json(err);
    }
}

const getFriend = async(req,res)=>{
    try{
        const user = await User.findById(req.params.userId);
        const friends = await Promise.all(
            user.followings.map((friendId)=>{
                return User.findById(friendId)
            })
        )
        let friendList = [];
        friends.map((friend)=>{
            const {_id,username,profilePicture} = friend
            friendList.push({_id,username,profilePicture}) 
        })
        return res.status(200).json(friendList);
    }catch(err){
        return res.status(500).json(err);
    }
}

const followUser = async(req,res)=>{
    if(req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$push : {follower : req.body.userId}});
                await currentUser.updateOne({ $push : {followings : req.params.id}})
                return res.status(200).json("follwed");
            }else{
                return res.status(403).json("you allready follow this user");
            }
        }catch(err){
            return res.status(500).json(err);
        }
    }else {
        res.status(403).json("you cant follow yourself");
      }
}
const unFollowUser = async(req,res)=>{
    if(req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$pull : {follower : req.body.userId}});
                await currentUser.updateOne({ $pull : {followings : req.params.id}})
                return res.status(200).json("unFollwed");
            }else{
                return res.status(403).json("you allready follow this user");
            }
        }catch(err){
            return res.status(500).json(err);
        }
    }else {
        res.status(403).json("you cant unfollow yourself");
      }
}
module.exports = {
    updatePro,
    getUser,
    getFriend,
    followUser,
    unFollowUser
}