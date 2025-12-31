import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: 0,
    },
    image: {
      type: String,
      default: 'https://via.placeholder.com/300',
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      trim: true,
    },
    subscriptionEligible: {
      type: Boolean,
      default: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 4.5,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;

