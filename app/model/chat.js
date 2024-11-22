const mongoose = require('mongoose');
const Schemaa = mongoose.Schema;


const chathatSchema=new Schemaa({
    sender_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    receiver_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:"user"
    },
    message:{
        type:String,
        required:true
    },
    is_read:{
        type:String,
        default:0
    }
},
{
    timestamps:true
})