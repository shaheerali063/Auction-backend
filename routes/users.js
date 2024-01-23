var express = require('express');
var router = express.Router();
const verifyToken = require('../middleware/auth');
const userController = require('../controllers/user');

router.put('/update/:id', verifyToken, userController.updateUser);
router.get('/', verifyToken, userController.getUsers);
router.get('/show/:id', verifyToken, userController.getUser);
router.post('/create-bid', verifyToken, userController.createBid);
router.post('/list-product', verifyToken, userController.listProduct);
router.get(
  '/product-report',
  verifyToken,
  userController.getSellerProductReport
);
router.get('/products', verifyToken, userController.getUserProducts);
router.get('/product-bids/:id', verifyToken, userController.fetchProductBids);

module.exports = router;
