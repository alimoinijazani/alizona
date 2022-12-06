import express from 'express';
import User from '../models/userModel';

const userRouter = express.Router();
userRouter.get('/', async (req, res) => {
  const user = await User.find({});
  res.send(user);
});
