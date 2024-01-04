const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const purchaseSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product' },
  seller: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  buyer: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  auction: { type: Schema.Types.ObjectId, required: true, ref: 'Auction' },
  price: { type: Number, default: 0 },
  date: { type: Date, default: new Date() },
});

const Purchase = mongoose.model('Purchase', purchaseSchema);
module.exports = Purchase;
