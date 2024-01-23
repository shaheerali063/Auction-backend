const auctionService = require('../services/auctionService');

async function createAuction(req, res) {
  if (req.userData.role === 'buyer') {
    return res.status(401).send({
      message: 'You do not have permission to perform this action.',
    });
  }
  const { newAuction, errors } = await auctionService.createAuction(
    req.body,
    req.userData.role
  );
  console.log(newAuction);
  if (errors) {
    return res.status(412).json(errors);
  }
  return res.status(200).json({
    success: true,
    message: 'Auction created successfully',
    data: newAuction,
  });
}

const getAvailableAuctions = async (req, res) => {
  const { auctions, errors } = await auctionService.getAvailableAuctions();
  if (errors) {
    return res.status(412).json(errors);
  }
  return res.status(200).json({
    success: true,
    data: auctions,
  });
};

const getAuctions = async (req, res) => {
  if (req.userData.role !== 'admin') {
    return res.status(401).send({
      message: 'You do not have permission to perform this action.',
    });
  }
  const { auctions, errors } = await auctionService.getAuctions();
  if (errors) {
    return res.status(412).json(errors);
  }
  return res.status(200).json({
    success: true,
    data: auctions,
  });
};

const getAuction = async (req, res) => {
  const { id } = req.params;
  const { auction, errors } = await auctionService.getAuctionById(id);
  if (errors) {
    return res.status(412).json(errors);
  }
  return res.status(200).json({
    success: true,
    data: auction,
  });
};

const getAuctionProducts = async (req, res) => {
  const { id } = req.params;
  const { auction, errors } = await auctionService.getAuctionProducts(id);
  if (errors) {
    return res.status(412).json(errors);
  }
  return res.status(200).json({
    success: true,
    data: auction,
  });
};

module.exports = {
  createAuction,
  getAvailableAuctions,
  getAuctions,
  getAuction,
  getAuctionProducts,
};
