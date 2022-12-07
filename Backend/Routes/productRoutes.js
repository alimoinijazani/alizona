import express from 'express';
import Product from '../models/productModel.js';
const productRouter = express.Router();

productRouter.get('/', async (req, res) => {
  const product = await Product.find();
  res.send(product);
});
productRouter.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).send({ message: 'product not found' });
  }
  res.send(product);
});
productRouter.get('/product/:slug', async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (!product) {
    return res.status(404).send('Product not found');
  }
  res.send(product);
});

export default productRouter;
