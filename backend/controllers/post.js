const { request } = require('../app')
const Post = require('../models/Post')

const User = require('../models/User')
const mongoose = require("mongoose");
const ObjectId = require('mongodb').ObjectId; 

exports.createPost = async (req, res) => {

    try {

        const newPostdata = {
            caption: req.body.caption,
            image: {
                public_id: "req.body.public_id",
                url: "req.body.url"
            },
            owner: req.user._id
        }
        const post = await Post.create(newPostdata);
        const user = await User.findById(req.user._id);
        user.posts.push(post._id)
        // console.log(user)
        await user.save();
        res.status(201).json({
            success: true,
            post: post
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })

    }

}
exports.DeletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" })

        }

        if (post.owner.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            })
        }
        await post.remove();

        res.status(200).json({
            success: true,
            message: "post deleted"
        })
        const user = await User.findById(req.params_.id);
        const index = user.posts.indexOf(req.params.id);
        user.posts.splice(index, 1)
        await user.save()


    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })

    }







}

exports.getPostofFollowing= async(req,res)=>
{
    try{
        //const user= await User.findById(req.user._id).populate('following',"posts");
        //this is a way to find all the posts of a user
        //below is shown another way through which we can find posts of another user
        const user=await User.findById(req.user._id)
        const posts=await Post.find({
            owner:{
                $in:user.following}
        });

        res.status(200).json({success:true,posts})

    }
    catch(error){
        return res.status(500).json({success:false,message:error.message})
    }
}

















exports.likeAndUnlikePost = async (req, res) => {
    try {


        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }
        //________________________________________________________________________
        // const a = toString(req.user.id)

        // console.log("USerId==", req.user.id)
        // console.log(post.likes)
        // const user = User.findById(req.user.id);
        // console.log(post.likes[0]._id.toString( ) === );
        // console.log(ObjectId(req.user.id));
//__________________________________________________________________________________
      
        
        if (post.likes.includes(req.user.id))
        {
            const index = post.likes.indexOf(req.user._id);
            post.likes.splice(index, 1);
            await post.save();
            return res.status(200).json({
                success: true,
                message: "Post Unliked"
            })
        }
        else {
            post.likes.push(req.user.id);
            await post.save();
            return res.status(200).json({ success: true, message: "Post Liked" });
        }

    }

    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message

        })
    }
}
exports.updateCaption=async(req,res)=>{
    try{
        const post= await Post.findById(req.params.id)
        if(!post){
            return res.status(404).json({success:false,message:"Post not found"})
        }
        if(post.owner.toString()!==req.user._id.toString()){
            return res.status(401).json({success:false,message:"Unauthorized"})
        }
        post.caption=req.body.caption;
        await post.save()
        res.status(200).json({Success:true,Message:"Post updated successfully"})


    }
    catch(error){
        return res.status(500).json({
            success:false,message:error.message
        })
    }
}


