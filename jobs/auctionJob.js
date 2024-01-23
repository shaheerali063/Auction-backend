const cron = require('node-cron');
const auctionModel = require('../models/auction');
const productModel = require('../models/product');
const purchaseModel = require('../models/purchase');
const userModel = require('../models/user');
const bidModel = require('../models/bid');
const mailer = require('../utils/mailer');
module.exports = () => {
  const fetchBids = async (auctionId, productId) => {
    try {
      const bids = await bidModel
        .find({ auction: auctionId, product: productId })
        .populate('buyer')
        .sort({ timestamp: -1 });

      return bids;
    } catch (error) {
      console.error('Error fetching bids:', error.message);
      throw error;
    }
  };

  const updateProductAndCreatePurchase = async (product, auction, buyer) => {
    try {
      const updatedProduct = await productModel.findOneAndUpdate(
        { _id: product._id },
        {
          buyer: buyer,
          status: 'sold',
          currentAuction: null,
          currentBid: product.currentBid,
        },
        { new: true }
      );

      if (updatedProduct) {
        await auctionModel.findOneAndUpdate(
          { _id: auction._id },
          { $pull: { products: product._id } }
        );
        const purchasedProduct = new purchaseModel({
          product: updatedProduct._id,
          seller: updatedProduct.seller,
          buyer: updatedProduct.buyer,
          auction: auction._id,
          price: updatedProduct.currentBid,
          date: new Date(),
        });
        purchasedProduct.save();
        if (purchasedProduct) {
          console.log('Product updated successfully:', updatedProduct);
          const buyer = await userModel.findById(purchasedProduct.buyer);
          await mailer.sendEmailToBuyer(
            buyer.email,
            product.name,
            auction.name
          );
        } else {
          console.log('Error creating purchase:', error);
        }
      } else {
        console.log('No matching product found');
      }
    } catch (error) {
      console.log('Error updating product:', error);
    }
  };

  const closeBidsForProduct = async (product, auction, ended) => {
    const bids = await fetchBids(auction._id, product._id);

    if (bids?.length > auction.minimumBids) {
      if (
        ended ||
        (bids[0]?.timestamp && hasPassedTwoMinutes(bids[0].timestamp))
      ) {
        await updateProductAndCreatePurchase(product, auction, bids[0].buyer);
      }
    } else {
      if (!ended) return;
      try {
        await productModel.findOneAndUpdate(
          { _id: product._id },
          { status: 'available', currentAuction: null, currentBid: 0 },
          { new: true }
        );
        await auctionModel.findOneAndUpdate(
          { _id: auction._id },
          { $pull: { products: product._id } }
        );
      } catch (error) {
        console.log('Error updating product:', error);
      }
    }
  };

  const closeBidsForAuction = async (auction, ended) => {
    try {
      for (const product of auction.products) {
        await closeBidsForProduct(product, auction, ended);
      }
    } catch (error) {}
  };

  const hasPassedTwoMinutes = (timestamp) => {
    const timeSinceLastBid = new Date() - timestamp;
    const twoMinutesInMilliseconds = 2 * 60 * 1000;
    return timeSinceLastBid >= twoMinutesInMilliseconds;
  };

  const runAuctionJob = async () => {
    console.log('Running auction job...');

    try {
      const endedAuctions = await auctionModel
        .find({ endTime: { $lte: new Date() }, active: true })
        .populate('products');

      const activeAuctions = await auctionModel
        .find({ active: true })
        .populate('products');

      for (const endedAuction of endedAuctions) {
        await closeBidsForAuction(endedAuction, true);
      }

      for (const activeAuction of activeAuctions) {
        await closeBidsForAuction(activeAuction, false);
      }
      await auctionModel.updateMany(
        { _id: { $in: endedAuctions.map((auction) => auction._id) } },
        { $set: { active: false } }
      );
    } catch (error) {
      console.error('Error in auction job:', error.message);
    }
  };

  cron.schedule('* * * * *', runAuctionJob);
};
