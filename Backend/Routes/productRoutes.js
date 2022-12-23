import express from 'express';
import Product from '../models/productModel.js';
import expressAsyncHandler from 'express-async-handler';
import { isAdmin, isAuth } from './../models/utils.js';
const productRouter = express.Router();

productRouter.get('/', async (req, res) => {
  const product = await Product.find();
  res.send(product);
});

const PAGE_SIZE = 3;
productRouter.get(
  '/search',
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const brand = query.brand || '';
    const category = query.category || '';
    const searchQquery = query.query || '';
    const price = query.price || '';
    const rating = query.rating || '';
    const order = query.order || '';

    const queryFilter =
      searchQquery && searchQquery !== 'all'
        ? {
            name: { $regex: searchQquery, $options: 'i' },
          }
        : {};
    const categoryFilter = category && category !== 'all' ? { category } : {};
    const ratingFilter =
      rating && rating !== 'all' ? { rating: { $gte: Number(rating) } } : {};
    const priceFilter =
      price && price !== 'all'
        ? {
            price: {
              $gte: Number(price.split('-')[0]),
              $lte: Number(price.split('-')[1]),
            },
          }
        : {};
    const sortOrder =
      order === 'featured'
        ? { featured: -1 }
        : order === 'lowest'
        ? { price: 1 }
        : order === 'highest'
        ? { price: -1 }
        : order === 'toprated'
        ? { rating: -1 }
        : order === 'newest'
        ? { createdAt: -1 }
        : { _id: -1 };

    const products = await Product.find({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countProducts = await Product.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    });
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  })
);
productRouter.get(
  '/admin',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const countProducts = await Product.countDocuments();
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;
    const products = await Product.find()
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    const pages = Math.ceil(countProducts / pageSize);
    res.send({ products, page, pages });
  })
);
productRouter.get('/category', async (req, res) => {
  const categories = await Product.find().distinct('category');
  res.send(categories);
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
productRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const newProduct = new Product({
      name: 'Sample Name' + Date.now(),
      slug: 'sample-slug' + Date.now(),
      category: 'sample category',
      image: '/image/p1',
      price: 0,
      countInStock: 0,
      brand: 'sample brand',
      rating: 0,
      numReviews: 0,
      description: 'sample Description',
    });
    const product = await newProduct.save();
    res.send({ message: 'product Created', product });
  })
);
productRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      (product.name = req.body.name),
        (product.slug = req.body.slug),
        (product.price = req.body.price),
        (product.image = req.body.image),
        (product.category = req.body.category),
        (product.brand = req.body.brand),
        (product.description = req.body.description),
        await product.save();
      res.send({ message: 'product Updated' });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);
export default productRouter;
