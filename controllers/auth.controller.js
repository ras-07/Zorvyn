 import mongoose from 'mongoose';
 import bcrypt from 'bcryptjs';
 import User from '../models/user.model.js';
 import jwt from 'jsonwebtoken'; 
 import { JWT_EXPIRES_IN,JWT_SECRET } from '../config/env.js';
 
 
 export const signUp=async(req,res,next)=>
 {
  
  const session=await mongoose.startSession();
  session.startTransaction();
  try{
    const { name,email,password,role,status }=req.body;
    const existingUser= await User.findOne({email});
    if(existingUser)
    {
      const error =new Error('user already exists');
      error.statusCode=409;
      throw error;
    }
    
    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(password,salt);
    const newUsers=await User.create([{name,email,password:hashedPassword,role,status }],{session});
    const token=jwt.sign({userId:newUsers[0]._id},JWT_SECRET,{expiresIn:JWT_EXPIRES_IN});
    await session.commitTransaction();
    res.status(201).json(
      {
        success:true,
        message:'User created successfully',
        data:
        {
          token,
          user:newUsers[0]
        }
      }
    );
  }
  catch(error)
  {
    await session.abortTransaction();
    next(error);
  }finally{
    session.endSession();
  }
 }

 export const signIn=async(req,res,next)=>
 {
  try
  {
    const {email,password}=req.body;
    const user= await User.findOne({email});
    if(!user)
    {
      const error=new Error('User not Found');
      error.statusCode=404;
      throw error;
    }
    const isPasswordValid=await bcrypt.compare(password,user.password);
    if(!isPasswordValid)
    {
      const error=new Error('Invalid password');
      error.status=401;
      throw error;
    }
    const token=jwt.sign({userId:user._id},JWT_SECRET,{expiresIn:JWT_EXPIRES_IN});
    res.status(200).json(
      {
        success:true,
        message:'User signed in successfully',
        data:
        {
          token,
          user,
        }
      });
  }
  catch(error)
  {
    next(error);
  }
 }

 export const signOut = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'User signed out successfully. Please clear your local tokens.'
    });
  } catch (error) {
    next(error);
  }
};