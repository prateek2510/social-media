const mongoose=require('mongoose');
const User = require('../models/User');

//const UserId = new mongoose.Schema({ UserID: String });


const postSchema=new mongoose.Schema({
    caption:String,
    image:{
        public_id:String,
        url:String
    },
    createdAt:{
        type:Date,
        default:Date.now

    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    likes:
    // [UserId]
    [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ]
    ,
    comments:[{
        user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        },
        comment:{
            type:String,
            required:true,
        },
    }],

});

module.exports=mongoose.model('Post',postSchema)