const adminService = require('../services/adminService');

const inviteAdmin = async (req, res) => {
  const { userId } = req.body;
  if (req.userData.role !== 'admin') {
    return res
      .status(403)
      .json({ message: 'Only admins can add other admins' });
  }
  const result = await adminService.inviteAdminService(userId);

  return res.status(result.success ? 200 : 400).json(result);
};

const approveAuction = async (req, res) => {
  if (req.userData.role !== 'admin') {
    return res
      .status(403)
      .json({ message: 'Only admins can approve auctions' });
  }
  const auctionId = req.params.id;
  const result = await adminService.approveAuctionService(auctionId);

  return res.status(result.success ? 200 : 400).json(result);
};

module.exports = {
  inviteAdmin,
  approveAuction,
};
