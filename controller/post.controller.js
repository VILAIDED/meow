const Post = require("../models/Post")
const User = require("../models/User")

const newPost = async (req,res)=>{
    
    const newPost = new Post(req.body);
    try{
        const savedPost = await newPost.save();
        res.status(200).json(savedPost)
    }catch(err){
        res.status(500).json(err)
    }
}

const updatePost = async(req,res)=>{
    
    try{
        console.log(req.params.id)
        const post = await Post.findOne({"_id" : req.params.id});
        console.log(post)
        if(post.userId == req.body.userId){
            await post.updateOne({$set : req.body})
            res.status(200).json("the post has been update")
        }else{
            res.status(403).json("you can update only your post")
        }
    }catch(err){
        res.status(500).json(err)
    }
}
const deletePost = async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id)
        if(post.userId == req.body.userId){
            await post.deleteOne();
            res.status(200).json("the post has been deleted")
        }else{
            res.status(403).json("you can delete only your post")
        }
    }catch(err){
        res.status(500).json(err);
    }
}

const likePost = async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push : {likes : req.body.userId}})
           return res.status(200).json("liked")
        }else{
            await post.updateOne({$pull : {likes : req.body.userId}})
           return res.status(200).json("unliked")
        }
    }catch(err){
        return res.status(500).json(err);
    }
}

const getPost = async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
       return res.status(200).json(post);
    }catch(err){
        return res.status(500).json(err)
    }
}
const timelinePost = async(req,res)=>{
    try{
        const currentUser = await User.findById(req.params.userId)
        const userPosts = await Post.find({userId : currentUser._id})
        const friendPost = await Promise.all(
            currentUser.followings.map((friendId)=>{
                return Post.find({userId : friendId})
               
            })
        )
        return res.status(200).json(userPosts.concat(...friendPost))
    }catch(err){
        return res.status(500).json(err)
    }
}

const getUserPost = async(req,res)=>{
    try{
        const user = await User.findOne({username : req.params.username});
        const posts = await Post.find({userId : user._id});
        return res.status(200).json(posts);
    }catch(err){
        return res.status(500).json(err);
    }
}
module.exports = {
    newPost,
    updatePost,
    deletePost,
    likePost,
    getPost,
    getUserPost,
    timelinePost

}