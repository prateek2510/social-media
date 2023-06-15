const Post = require('../models/Post');
const User=require('../models/User')


//User registration code
exports.register = async(req,res)=>{
    try{
        

        const{name,email,password}=req.body;

        let user= await User.findOne({email});
        if(user) {return res.status(400).json({success:false,
            message:"User already exists"})}
            user = await User.create({name,email,password,avatar:{public_id:"sample id",
            url:"sample url"}})
            res.status(201).json({success:true,user})
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })

    }
}

//user login code
exports.login=async(req,res)=>
{
    try{
        const{email,password}=req.body;
        const user=await User.findOne({email}).select("+password");
        if(!user){
            res.status(400).json({
                success:false,
                message:"User does not exist"
            })
        }
        const isMatch= await user.matchPassword(password)
        if(!isMatch){
            return res.status(400).json({
                success:false,
                message:"Incorrect password"
            })
        }
        const options={expires:new Date(Date.now()+90*24*60*60*1000),
            httpOnly:true}
        const token= await user.generateToken();
        res.status(201).cookie("token",token,options).json({
            success:true,
            message:"User logged in successfully",
            user,token
        })

    }
    catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        })

    }
}
// user logout code
exports.logout=async(req,res)=>
{
    try{
        res.status(200)
        .cookie("token",null,{expires:new Date(Date.now()),httpOnly:true})
        .json({success:true,message:"User logged out"})
    }

    

    catch(error){
        return res.status(500).json({
            success:true,message:error.message
        })
    }
}











//Follow user code

exports.followUser= async(req,res)=>{
try{
    const userToFollow= await User.findById(req.params.id);
    const loggedInUser= await User.findById(req.user._id)
    if(!userToFollow){
        return res.status(404).json({success:false,
        message:"User not found"})
    }
    if(loggedInUser.following.includes(userToFollow._id)){
    
        const indexfollowing=loggedInUser.following.indexOf(userToFollow._id)
     
        loggedInUser.following.splice(indexfollowing,1)
        
        const indexfollowers=userToFollow.followers.indexOf(loggedInUser._id)
        
        userToFollow.followers.splice(indexfollowers,1)
        
        
    
    await loggedInUser.save()
    await userToFollow.save()
    res.status(200).json({
        success:true,
        message:"User Unfollowed"
    });
    }
    else{

    loggedInUser.following.push(userToFollow._id);
    userToFollow.followers.push(loggedInUser._id)
    await loggedInUser.save()
    await userToFollow.save()
    res.status(200).json({
        success:true,
        message:"User followed"
    });
    }


}
catch(error){
    return res.status(500).json({success:false,
    message:error.message})

}

}
exports.updatePassword= async(req,res)=>{
    try{
        const user= await User.findById(req.user._id).select("+password")
        const {oldPassword,newPassword}=req.body;
        const isMatch=await user.matchPassword(oldPassword)
        if(!oldPassword||!newPassword){
            return res.status(400).json({
                success:false,message:"Please provide old and new password"
            })
        }
        if(!isMatch){
            return res.status(400).json({success:false,message:"Incorrect old password"})
        }
    
            user.password=newPassword;
            await user.save()
            return res.status(200).json({success:true,message:"Password updated"})
        

    }
    catch(error){
        return res.status(500).json({success:false,
        message:error.message})
    }
}
exports.updateProfile=async(req,res)=>{
    try{
        const user= await User.findById(req.user._id)
        const{name,email}=req.body;
        if(name){
            user.name=name
            await user.save()
            return res.status(200).json({success:true,message:"Name updated"})
        }
        if(email){
            user.email=email
            await user.save()
            return res.status(200).json({success:true,message:"email updated"})
    }
    }
    catch(error){
        return res.status(500).json({success:false,
        message:error.message})
    }
}

exports.deleteMyProfile=async(req,res)=>{
    try{
        const user2=await User.findById(req.user._id);
        const posts=user2.posts;
        //posts varibale will show all the posts created by user2
        const following=user2.following
        //it is an array of users following user2
        const followers=user2.followers
        const userId=user2._id



        for(let i=0;i<following.length;i++){
            const follows=await User.findById(following[i])
            const index=follows.followers.indexOf(userId)
            follows.followers.splice(index,1)
            await follows.save()
        }    
        for(let i=0;i<followers.length;i++){
            const follower=await User.findById(followers[i])
            const index=follower.following.indexOf(userId)
            follower.following.splice(index,1)
            await follower.save()
        }
        for(i=0;i<posts.length;i++){
            const post=await Post.findById(posts[i])
            await post.remove()
        }
        await user2.remove()
        res.cookie("token",null,{expires:new Date(Date.now()),httpOnly:true})
        res.status(200).json({success:true,message:"Profile deleted!"})

    }
catch(error){
    return res.status(500).json({success:false,message:error.message})

}
}
exports.myProfile=async(req,res)=>{
    try{
        const user=await User.findById(req.user._id).populate('posts')
        res.status(200).json({success:true,user})
    }
    catch(error){
        return res.status(500).json({success:false,message:error.message})
    }

}
exports.getUserProfile=async(req,res)=>{
    try{
        const user= await User.findById(req.params.id).populate('posts')
        if(!user){
            return res.status(404).json({success:false,Message:"User not found"})

        }
        else{
            return res.status(200).json({success:true,user})
        }

    }
    catch(error){
        return res.status(500).json({success:false,message:error.message})
    }
}
exports.getAllUsers= async(req,res)=>{
    try{
        const users=await User.find({})
        res.status(200).json({success:true,users})        

    }
    catch(error){
        return res.status(500).json({success:false,message:error.message})
    }
}