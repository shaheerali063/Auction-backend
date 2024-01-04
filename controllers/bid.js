const userModel = require('../models/user');
const productModel = require('../models/product');
const auctionModel = require('../models/auction');

const productController = require('./product');
const bidModel = require('../models/bid');

async function createBid(bidData, buyerId) {
  try {
    const { productId, amount, automaticBidding } = bidData;
    const reqProduct = await productModel.findOne({ _id: productId });
    const reqAuction = await auctionModel.findOne({
      _id: reqProduct.currentAuction,
    });
    const isPresent = reqAuction.products.includes(reqProduct.id);
    if (
      reqAuction.active &&
      Date.now() < reqAuction.endTime &&
      Date.now() > reqAuction.startTime &&
      reqAuction.status === 'approved' &&
      isPresent &&
      reqProduct.status === 'live' &&
      amount > reqProduct.minimumBidAmount &&
      amount > reqProduct.currentBid
    ) {
      const bid = new bidModel({
        buyer: buyerId,
        product: productId,
        auction: reqProduct.currentAuction,
        amount: amount,
        automaticBidding: automaticBidding,
      });
      reqProduct.currentBid = amount;
      reqProduct.save();
      return await bid.save();
    } else {
      throw new Error('Invalid bid');
    }
  } catch (err) {
    throw err;
  }
}

async function fetchBids(productId, auctionId) {
  try {
    const bids = await bidModel
      .find({
        product: productId,
        auction: auctionId,
      })
      .populate('buyer');
    return bids.reverse();
  } catch (error) {
    throw new Error('Error fetching bids: ' + error.message);
  }
}

module.exports = { createBid, fetchBids };
