import express from 'express';

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import seedRouter from './Routes/seedRoutes.js';
import productRouter from './Routes/productRoutes.js';
import userRouter from './Routes/userRoutes.js';
dotenv.config();
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Mongodb Connected...'))
  .catch((err) => console.log(err));

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api/seed', seedRouter);
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`listen port ${port}`));
