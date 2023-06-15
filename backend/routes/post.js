const express=require('express')
const router=express.Router();
const {createPost,likeAndUnlikePost, DeletePost, getPostofFollowing, updateCaption}=require("../controllers/post")
const {isAuthenticated}=require('../middlewares/auth')

router.route("/post/upload").post(isAuthenticated,createPost);
router.route("/post/:id").get(isAuthenticated,likeAndUnlikePost)
.delete(isAuthenticated,DeletePost).put(isAuthenticated,updateCaption)

router.route('/posts').get(isAuthenticated,getPostofFollowing)
// localhost:4000/api/v1/post/upload

module.exports=router;
