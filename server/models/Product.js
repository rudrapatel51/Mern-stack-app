import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  imageUrl: String,
  category:String,
  totalStock: {
    type: Number,
    required: true, 
    default: 0, 
  },
});

const Product = mongoose.model('Product', ProductSchema);

export default Product;
