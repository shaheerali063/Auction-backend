const mongoose = require("mongoose");
const Schema = mongoose.Schema;

productSchema = new mongoose.Schema({
  seller: { type: Schema.Types.ObjectId, ref: "Seller", required: true },
  name: { type: String, required: true },
  description: {
    type: String,
    required: true,
    default: "No description provided",
  },
  images: [{ type: String }],
  minimumBidAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["live", "sold", "delivered"],
    default: "live",
  },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
