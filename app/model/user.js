const mongoose = require('mongoose');
const Schemaa = mongoose.Schema;


const userSchema=new Schemaa({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    image:{
        type:String,
        default:'image'
    },
    password:{
        type:String,
        required:true
    },
    is_online:{
        type:String,
        default:'0'
    }
},
{
    timestamps:true
})

const userModel=mongoose.model('user',userSchema);  
module.exports=userModel;