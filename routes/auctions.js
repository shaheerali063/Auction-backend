var express = require('express');
var router = express.Router();

const auctionController = require('../controllers/auction');
const verifyToken = require('../middleware/auth');

router.get('/all-auctions', verifyToken, auctionController.getAuctions);
router.get(
  '/available-auctions',
  verifyToken,
  auctionController.getAvailableAuctions
);
router.get('/show/:id', verifyToken, auctionController.getAuction);
router.get('/:id/products', verifyToken, auctionController.getAuctionProducts);

module.exports = router;
