const router = require("express").Router();
const {verifyToken} = require("../controller/auth.controller");
const {newPost,updatePost,deletePost,likePost,getPost,timelinePost,getUserPost} = require('../controller/post.controller')

router.route("/").post(newPost);
router.route('/:id').put(updatePost);
router.route('/:id').delete(deletePost);
router.route('/:id/like').put(likePost);
router.route('/:id').get(getPost);
router.route('/timeline/:userId').get(timelinePost);
router.route('/profile/:username').get(getUserPost);   
module.exports = router