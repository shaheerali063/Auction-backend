const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new mongoose.Schema({
  seller: { type: Schema.Types.ObjectId, ref: "Seller", required: true },
  name: { type: String, required: true, min: 3 },
  description: {
    type: String,
    default: "No description provided",
  },
  images: {
    type: Array,
  },
  minimumBidAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["live", "sold", "delivered"],
    default: "live",
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
