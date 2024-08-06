import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  imageUrl: String,
  category:String,
});

const Product = mongoose.model('Product', ProductSchema);

export default Product;
