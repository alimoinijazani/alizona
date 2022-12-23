import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, minlength: 3, requierd: true, unique: true },
    slug: { type: String, minlength: 3, requierd: true, unique: true },
    category: { type: String, maxlength: 50, minlength: 3, requierd: true },
    image: { type: String, minlength: 3, requierd: true },
    price: { type: Number, min: 0, requierd: true },
    countInStock: { type: Number, min: 0, requierd: true },
    brand: { type: String, maxLength: 50, minLength: 3, requierd: true },
    rating: { type: Number, min: 0, max: 5, requierd: true },
    numReviews: { type: Number, min: 0, requierd: true },
    description: { type: String, maxLength: 50, minLength: 3, requierd: true },
  },
  { timestamps: true }
);
const Product = new mongoose.model('Product', productSchema);

export default Product;
