const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new mongoose.Schema({
  seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  buyer: { type: Schema.Types.ObjectId, ref: 'User' },
  currentAuction: { type: Schema.Types.ObjectId, ref: 'Auction' },
  name: { type: String, required: true, min: 3 },
  description: {
    type: String,
    default: 'No description provided',
  },
  images: {
    type: Array,
  },
  minimumBidAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['available', 'live', 'sold', 'delivered'],
    default: 'available',
  },
  currentBid: { type: Number, default: 0 },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
