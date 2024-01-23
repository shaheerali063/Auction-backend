const auctionModel = require('../models/auction');

async function createAuction(auctionData, role) {
  const { name, startTime, endTime, minimumBids } = auctionData;
  const status = role === 'admin' ? 'approved' : 'pending';
  const active =
    role === 'admin' && new Date(startTime) <= new Date() ? true : false;

  try {
    if (startTime >= endTime || minimumBids < 0) {
      throw new Error('Wrong input parameters.');
    }
    const newAuction = new auctionModel({
      name,
      startTime,
      endTime,
      minimumBids,
      active,
      status,
    });

    await newAuction.save();
    return { newAuction };
  } catch (error) {
    return {
      errors: {
        success: false,
        message: error.message,
      },
    };
  }
}

async function getAvailableAuctions() {
  try {
    const auctions = await auctionModel
      .find({ active: true })
      .sort({ startTime: -1 });
    return { auctions };
  } catch (error) {
    return {
      errors: {
        success: false,
        message: error.message,
      },
    };
  }
}

async function getAuctions() {
  try {
    const auctions = await auctionModel
      .find()
      .populate('products')
      .sort({ startTime: -1 });
    return { auctions };
  } catch (error) {
    return {
      errors: {
        success: false,
        message: error.message,
      },
    };
  }
}

async function getAuctionById(id) {
  try {
    const auction = await auctionModel.findById(id);
    return { auction };
  } catch (error) {
    return {
      errors: {
        success: false,
        message: error.message,
      },
    };
  }
}

async function getAuctionProducts(id) {
  try {
    const auction = await auctionModel.findById(id).populate('products');
    return { auction };
  } catch (error) {
    return {
      errors: {
        success: false,
        message: error.message,
      },
    };
  }
}

module.exports = {
  createAuction,
  getAvailableAuctions,
  getAuctions,
  getAuctionById,
  getAuctionProducts,
};
