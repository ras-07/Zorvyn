import mongoose from 'mongoose';
const userSchema=new mongoose.Schema(
  {
    name:{
      type:String,
      required:[true,'User Name is required'],
      trim:true,
      minLength:2,
      maxLength:50
    },
    email:{
      type:String,
      required:[true,'User Email is required'],
      trim:true,
      unique:true,
      lowercase:true,
      match:[/\S+@\S+\.\S+/,'Please fill a valid email address'],
    },
    password:{
      type:String,
      required:[true,'user password is required'],
      minLength:7,
    },
    role: {
      type: String,
      enum: ['Viewer', 'Analyst', 'Admin'],
      default: 'Viewer' 
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },
  },{timestamps:true}
);
const User=mongoose.model('User',userSchema);
export default User;