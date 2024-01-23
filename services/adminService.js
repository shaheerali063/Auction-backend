const userModel = require('../models/user');
const { getAuctionById } = require('../services/auctionService');

const inviteAdminService = async (userId) => {
  try {
    const user = await userModel.findById(userId);
    if (user) {
      user.user_type = 'admin';
      await user.save();
      return { success: true, message: 'User successfully updated!' };
    } else {
      return { success: false, message: 'User does not exist' };
    }
  } catch (err) {
    return { success: false, message: err.message };
  }
};

const approveAuctionService = async (auctionId) => {
  try {
    const { auction, errors } = await getAuctionById(auctionId);
    if (errors) {
      return errors;
    }

    if (auction) {
      auction.status = 'approved';
      auction.active = true;
      await auction.save();
      return { success: true, message: 'Auction successfully approved!' };
    } else {
      return { success: false, message: 'Auction does not exist' };
    }
  } catch (err) {
    return { success: false, message: err.message };
  }
};

module.exports = {
  inviteAdminService,
  approveAuctionService,
};
