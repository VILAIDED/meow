const router = require('express').Router()
const {verifyToken} = require('../controller/auth.controller')
const {updatePro,getUser,followUser,unFollowUser,getFriend} = require("../controller/user.controller")

router.route('/:id').put(updatePro);
router.route("/").get(getUser);
router.route('/friends/:userId').get(getFriend);
router.route('/:id/follow').put(followUser);
router.route('/:id/unfollow').put(unFollowUser);

module.exports = router