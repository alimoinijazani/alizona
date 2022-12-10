import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import { generateToken } from './../models/utils.js';
const userRouter = express.Router();

userRouter.get('/', async (req, res) => {
  const user = await User.find();
  res.send(user);
});
userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(404).send({ message: 'wrong email or passwodd ' });
  })
);

export default userRouter;
