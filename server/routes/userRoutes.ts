import express from 'express';
import { connectToDB } from '../db';

const router = express.Router();

// Get user profile
router.get('/profile/:email', async (req, res) => {
  const db = await connectToDB();
  const user = await db.collection('users').findOne({ email: req.params.email });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

// Update profile
router.put('/profile/:email', async (req, res) => {
  const db = await connectToDB();
  await db.collection('users').updateOne({ email: req.params.email }, { $set: req.body });
  res.json({ message: 'Profile updated' });
});

// Admin: Get all users
router.get('/admin/users', async (req, res) => {
  const db = await connectToDB();
  const users = await db.collection('users').find({}).toArray();
  res.json(users);
});
