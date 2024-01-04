const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bidSchema = new Schema({
  auction: { type: Schema.Types.ObjectId, ref: 'Auction', required: true },
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  buyer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  automaticBidding: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
});

const Bid = mongoose.model('Bid', bidSchema);

module.exports = Bid;
