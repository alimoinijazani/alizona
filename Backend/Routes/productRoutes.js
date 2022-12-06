import express from 'express';
import Product from '../models/productModel.js';
const productRouter = express.Router();

productRouter.get('/', async (req, res) => {
  const product = await Product.find();
  res.send(product);
});

export default productRouter;
