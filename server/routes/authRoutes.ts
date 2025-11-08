import express, { response } from 'express';
import { connectDB } from '../config/db';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import { authenticateToken } from 'server/authMiddleware/authMiddleware';

const router = express.Router();
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: 'your@gmail.com', pass: 'your-app-password' },
});

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();





// Define the user type
interface User {
  email: string;
  password: string;
  name?: string;
}

// export const registerUser = async (req: Request, res: Response): Promise<void> => {
//   try {
//    // const { email, password, name }: User = req.body;
// const data: User = await res.json(); // ✅ Correct
// console.log(data.name);
// const email = data.email;
// const name = data.name;
// const password = data.password;
// console.log("passowr dis here",password)
//     if (!data.email || !data.password) {
//         // response.status(200).json({ success: true });
//       //  res.status(400).json({ message: 'Email and password are required' });
//       response.status(400).json({ message: 'Email and password are required' });
//       return;
//     }

//     const db = await connectDB();
//     const usersCollection = db.collection<User>('users');

//     const existing = await usersCollection.findOne({ email });

//     if (existing) {
//       response.status(400).json({ message: 'Email already registered' });
//       return;
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     await usersCollection.insertOne({
//        email,
//       password: hashedPassword,
//       name,
//     });

//     response.status(200).json({ message: 'Registered successfully' });
//   } catch (error) {
//     console.error('Register error:', error);
//     response.status(500).json({ message: 'Server error' });
//   }
// };





// Register


// Request OTP (after password is validated)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const db = await connectDB();
  const user = await db.collection('users').findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ message: 'Invalid credentials' });

  const otp = generateOTP();
  const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

  await db.collection('users').updateOne({ email }, { $set: { otp, otpExpires } });

  await transporter.sendMail({
    from: 'your@gmail.com',
    to: email,
    subject: 'Your OTP',
    text: `Your OTP is ${otp}`,
  });

  res.json({ message: 'OTP sent to email' });
});

// Verify OTP
router.post('/verify-otp',authenticateToken, async (req, res) => {
  const {   otp } = req.body;
  const db = await connectDB();
  const user = await db.collection('users').findOne({ req.user.email });

  if (!user || user.otp !== otp || new Date() > new Date(user.otpExpires)) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  await db.collection('users').updateOne({ email }, { $unset: { otp: "", otpExpires: "" } });

  const token = `${email}-token`;
  res.json({ message: 'OTP verified', token, user });
});
