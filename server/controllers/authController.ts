// controllers/rawSaveController.ts
import express, { Request, Response } from 'express';
import { connectDB } from '../config/db.ts';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';

import { ObjectId } from 'mongodb';
 
 

const isEmailValid = (email: string): boolean => {
  //const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return emailRegex.test(email);
};

 



export const registerUser = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const {  email, password } = req.body;

    
    const role = email === 'gajanandprajapat843@gmail.com' ? 'admin' : 'user';

      if ( !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

   // 2. Email format check
  if (!isEmailValid(email)) {
    return res.status(400).json({ message: 'Invalid email format.' });
  }




 
    const db = await connectDB();
    const collection = db.collection('profiles');




     
     
    const usersCollection = db.collection('profiles');

    // 3. Check if email already exists
    const existingUser = await usersCollection.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered.' });
    }
    console.log("password is here ",password);
    const hashedPassword = await bcrypt.hash(password, 10);
   console.log("hashassword is here ",hashedPassword);
    delete data.password;
   // const token = jwt.sign({ email}, JWT_SECRET, { expiresIn: '2h' });
    const result = await usersCollection.insertOne({data,role,password: hashedPassword,isVerify:"false"});
 console.log("result   +++++++++++++",result);
     // const user = await db.collection('profiles').findOne({ _id: new ObjectId(result.insertedId) });
           const token = jwt.sign({"id":result.insertedId.toString() ,"email":email,"role":role}, JWT_SECRET, { expiresIn: '2h' });
     console.log("after result    +++++++++++++",result);
           res.status(201).json({ message: '✅ Profile saved',result,token, id: result.insertedId });
  } catch (error: any) {
    console.error('❌ Error saving profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { sendOtpEmail } from '../utils/sendOtp.ts';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'aajamariglai331501';

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export const requestOtp = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required.' });

  const db = await connectDB();
  const users = db.collection('profiles');

  const otp = generateOTP();
  const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 mins expiry

 await db.collection('profiles').updateOne(
  { 'data.email': email },
  { $set: { otp:otp, otpExpires: otpExpires } }
);

  await sendOtpEmail(email, otp);

  res.json({ message: 'OTP sent to your email.' });
};

export const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  if ( !otp) {
    return res.status(400).json({ message: 'Email and OTP required.' });
  }

  const db = await connectDB();
  const user = await db.collection('profiles').findOne({ "data.email":email });

  if (!user || user.otp !== otp || new Date() > new Date(user.otpExpires)) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }
 
 
  await db.collection('profiles').updateOne(
     { 'data._id': req.user.id },
    { $unset: { otp: '', otpExpires: '' } }
  );

   const token = jwt.sign({"id":result.insertedId.toString() ,"email":email,"role":role}, JWT_SECRET, { expiresIn: '2h' });

  console.log(token, 'email is verified successfully');

  return res.status(200).json({
    message: 'OTP verified ✅',
    token,
    user: {
      email: user.data.email,
      id: user._id,
      role:user.role
    },
  });
};




















export const loginWithOtp = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });

    const db = await connectDB();
   const user = await db.collection('profiles').findOne({ 'data.email': email });

 console.log("email Paswword", email, password.toString(),user.password )
    if (!user || !(await bcrypt.compare(password.toString(), user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

  await  requestOtp(req, res);
    
   // return res.json({ message: 'OTP sent to email' });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};





export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const db = await connectDB();
    const users = await db.collection('profiles').find({}).toArray();

    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getSingleUser = async (req: Request, res: Response) => {
  try {
    const db = await connectDB();
    const { id } = req.params;
      
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await db.collection('profiles').findOne({ _id: new ObjectId(id) });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const db = await connectDB();
    const { id } = req.user.id;
      
    console.log("user Id is here of userProfile",req.user.id);

    console.log("Raw ID:", req.user.id);
console.log("Length:", req.user.id?.length);
console.log("Hex only:", /^[a-fA-F0-9]+$/.test(req.user.id));
    console.log("User ID:", id);
    if (!ObjectId.isValid(req.user.id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await db.collection('profiles').findOne({ _id: new ObjectId(req.user.id) });
     console.log("user of profile",user);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


export const Search = async (req: Request, res: Response) => {
  try {
   const db = await connectDB();
const collection = db.collection('profiles');

const { name, location, age } = req.query;

const filter: any = {};

// Access nested fields inside `data`
if (name) {
  filter['data.displayName'] = { $regex: new RegExp(name as string, 'i') };
}
if (location) {
  filter['data.location'] = { $regex: new RegExp(location as string, 'i') };
}
if (age) {
  filter['data.age'] = parseInt(age as string);
}

const users = await collection.find(filter).toArray();
res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};



export const sendInvitationEmail = async (req: Request, res: Response) => {
  const {  fromUserId,
        toUserId,
        message } = req.body;

  // if (!email || !name) {
  //   return res.status(400).json({ message: 'Email and name are required.' });
  // }

  try {
 const transporter = nodemailer.createTransport({
     service: 'gmail',
     auth: {
       user:"gajanandprajapat843@gmail.com",
       pass:"jqkmytyihbghoqjn" ,
     },
   });
    const db = await connectDB();
    const fromUser = await db.collection('profiles').findOne({ _id: new ObjectId(fromUserId) });
    const  touser = await db.collection('profiles').findOne({ _id: new ObjectId(toUserId) });
      const fromUseremail= fromUser?.data.email;
      const ToUseremail= touser?.data.email;
      const  name = touser?.data.displayName; 
      console.log("touseremail"+fromUseremail +"ToUseremail" +ToUseremail+"name"+name)
      const chatUrl = `https://hangouts.google.com/chat/person/${encodeURIComponent(fromUseremail)}`;
    const mailOptions = {
      from: `"Connect Hub" ${fromUseremail} `,
      to: ToUseremail,
      subject: 'You’re Invited to Join Connect Hub 💌',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 16px; color: #333;">
          <h2>Hey ${name},</h2>
          <p>You’ve been invited to join <strong>Connect Hub</strong> – a platform for new beginnings 💖</p>
          <p>Invitation Message from :${message}</p>
          <p>Click below to create your profile and start meaningful conversations:</p>
          <a href= ${chatUrl} style="padding: 10px 20px; background-color: #ff5a5f; color: white; text-decoration: none; border-radius: 5px;">Join Now</a>
          <p style="margin-top: 20px;">Thanks,<br/>The Connect Hub Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Invitation email sent successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send email.', error });
  }
};



