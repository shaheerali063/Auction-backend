const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const auctionSchema = new Schema({
  name: { type: String, required: true },
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  minimumBids: { type: Number, default: 0 },
  active: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['pending', 'approved', 'closed'],
    default: 'pending',
  },
});

const Auction = mongoose.model('Auction', auctionSchema);
module.exports = Auction;
