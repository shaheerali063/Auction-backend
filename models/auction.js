const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const auctionSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "Product" },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  minimumBids: { type: Number, default: 0 },
  status: { type: String, enum: ["approved", "pending"], default: "pending" },
});

const Auction = mongoose.model("Auction", auctionSchema);
export default Auction;
