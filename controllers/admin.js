const userModel = require('../models/user');
const auctionModel = require('../models/auction');

const inviteAdmin = async (req, res) => {
  const { userId } = req.body;
  if (req.userData.role !== 'admin') {
    return res
      .status(403)
      .json({ message: 'Only admins can add other admins' });
  }
  try {
    const user = await userModel.findById(userId);
    if (user) {
      user.user_type = 'admin';
      await user.save();
      return res.status(200).json({
        message: 'user successfully updated!',
        success: true,
      });
    } else {
      return res.status(400).json({
        message: 'user does not exist',
        success: false,
      });
    }
  } catch (err) {
    return res.status(412).send({
      success: false,
      message: err.message,
    });
  }
};

const approveAuction = async (req, res) => {
  if (req.userData.role !== 'admin') {
    return res
      .status(403)
      .json({ message: 'Only admins can approve auctions' });
  }
  try {
    const auctionId = req.params.id;
    const auction = await auctionModel.findOne({ _id: auctionId });
    if (auction) {
      auction.status = 'approved';
      auction.active = true;
      await auction.save();
      return res.status(200).json({
        message: 'auction successfully approved!',
        success: true,
      });
    } else {
      return res.status(400).json({
        message: 'auction does not exist',
        success: false,
      });
    }
  } catch (err) {
    return res.status(412).send({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  inviteAdmin,
  approveAuction,
};
