const auctionModel = require('../models/auction');

async function createAuction(auctionData, role) {
  const { name, startTime, endTime, minimumBids } = auctionData;
  const status = role == 'admin' ? 'approved' : 'pending';
  const active = role == 'admin' && startTime < new Date() ? true : false;
  try {
    if (startTime >= endTime || minimumBids < 0) {
      throw new Error('Wrong input parameters.');
    }
    const newAuction = new auctionModel({
      name: name,
      startTime: startTime,
      endTime: endTime,
      minimumBids: minimumBids,
      active: active,
      status: status,
    });
    newAuction.save();
    return newAuction;
  } catch (error) {
    return res.status(412).send({
      success: false,
      message: error.message,
    });
  }
}

const getAvailableAuctions = async (req, res) => {
  try {
    const auctions = await auctionModel.find({ active: true });
    return res.status(200).json({
      success: true,
      data: auctions.reverse(),
    });
    //.reverse() to get the latest data at first
  } catch (error) {
    return res.status(412).send({
      success: false,
      message: error.message,
    });
  }
};

const getAuctions = async (req, res) => {
  if (req.userData.role !== 'admin') {
    return res.status(401).send({
      message: 'You do not have permission to perform this action.',
    });
  }
  try {
    const auctions = await auctionModel.find().populate('products');
    return res.status(200).json({
      success: true,
      data: auctions.reverse(),
    });
    //.reverse() to get the latest data at first
  } catch (error) {
    return res.status(412).send({
      success: false,
      message: error.message,
    });
  }
};

const getAuction = async (req, res) => {
  try {
    const { id } = req.params;
    const auction = await auctionModel.findById(id);

    return res.status(200).json({
      success: true,
      data: auction,
    });
    //.reverse() to get the latest data at first
  } catch (error) {
    return res.status(412).send({
      success: false,
      message: error.message,
    });
  }
};

const getAuctionProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const auction = await auctionModel.findById(id).populate('products');
    console.log(auction);

    return res.status(200).json({
      success: true,
      data: auction,
    });
    //.reverse() to get the latest data at first
  } catch (error) {
    return res.status(412).send({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createAuction,
  getAvailableAuctions,
  getAuctions,
  getAuction,
  getAuctionProducts,
};
