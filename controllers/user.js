const userModel = require('../models/user');
const productModel = require('../models/product');
const auctionModel = require('../models/auction');
const bidModel = require('../models/bid');
const bidController = require('./bid');
const auctionController = require('./auction');
const productController = require('./product');

const updateUser = async (req, res) => {
  if (req.userData.role !== 'admin' && req.userData.id !== req.params.id) {
    return res.status(401).send({
      success: false,
      message: 'unauthorized action',
    });
  }
  userId = req.params.id;
  try {
    const updatedUser = await userModel.findOneAndUpdate(
      { _id: userId },
      req.body,
      { new: true }
    );

    if (!updatedUser) {
      throw new Error('User not found');
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser,
    });
  } catch (err) {
    return res.status(412).send({
      success: false,
      message: err.message,
    });
  }
};

const getUser = async (req, res) => {
  if (req.userData.role !== 'admin' && req.userData.id !== req.params.id) {
    return res.status(401).send({
      success: false,
      message: 'unauthorized actionsss',
    });
  }
  try {
    const user = await userModel.findById(req.params.id);

    if (!user) {
      throw new Error('DB Error: No users');
    }

    res.status(200).json({
      success: true,
      message: 'Users fetched successfully',
      data: user,
    });
  } catch (err) {
    return res.status(412).send({
      success: false,
      message: err.message,
    });
  }
};

const getUsers = async (req, res) => {
  if (req.userData.role !== 'admin') {
    return res.status(401).send({
      success: false,
      message: 'unauthorized action',
    });
  }
  try {
    const users = await userModel.find();

    if (!users) {
      throw new Error('DB Error: No users');
    }

    res.status(200).json({
      success: true,
      message: 'Users fetched successfully',
      data: users,
    });
  } catch (err) {
    return res.status(412).send({
      success: false,
      message: err.message,
    });
  }
};
const listProduct = async (req, res) => {
  const { productId, auctionId } = req.body;
  let product = await productModel.findById(productId);
  try {
    if (
      product.seller.toHexString() !== req.userData.id &&
      req.userData.role !== 'admin'
    ) {
      res.status(401).send({ message: 'Unauthorized User' });
    } else {
      const auction = await auctionModel.findOne({
        _id: auctionId,
        active: true,
      });
      if (auction) {
        if (auction.products.includes(productId)) {
          return res.status(400).json({
            success: false,
            message: 'Product is already listed in the auction.',
          });
        }
        auction.products.push(productId);
        await auction.save();
        product.status = 'live';
        product.currentAuction = auction._id;
        product.save();

        return res.status(200).json({
          success: true,
          message: 'Product listed in auction successfully',
          data: auction,
        });
      } else {
        return res.status(404).send({
          message: 'Auction not available.',
        });
      }
    }
  } catch (err) {
    return res.status(412).send({
      success: false,
      message: err.message,
    });
  }
};

const createBid = async (req, res) => {
  try {
    if (req.userData.role == 'buyer') {
      newBid = await bidController.createBid(req.body, req.userData.id);

      return res.status(200).json({
        success: true,
        message: 'bid created successfully',
        data: newBid,
      });
    } else {
      return res.status(401).send({
        message: 'Only buyers can bid on the products.',
      });
    }
  } catch (err) {
    return res.status(412).send({
      success: false,
      message: err.message,
    });
  }
};

async function autoBidding() {
  /* TODO: Requirement not clear. if multiple users has opted for the auto bid. whose bid should be placed first*/
}

const createAuction = async (req, res) => {
  try {
    if (req.userData.role !== 'buyer') {
      newAuction = await auctionController.createAuction(
        req.body,
        req.userData.role
      );
      return res.status(200).json({
        success: true,
        message: 'auction created successfully',
        data: newAuction,
      });
    } else {
      return res.status(401).send({
        message: 'Only sellers and admins can create auctions.',
      });
    }
  } catch (err) {
    return res.status(412).send({
      success: false,
      message: err.message,
    });
  }
};

const getSellerProductReport = async (req, res) => {
  try {
    if (req.userData.role === 'buyer') {
      return res.status(401).send({
        message: 'Unauthorized action',
      });
    }
    const sellerProducts = await productController.getUserProducts(
      req.userData.id,
      req.userData.role
    );
    return res.status(200).json({
      success: true,
      message: 'Seller product report retrieved successfully',
      data: sellerProducts,
    });
  } catch (err) {
    return res.status(412).send({
      success: false,
      message: err.message,
    });
  }
};

const getUserProducts = async (req, res) => {
  try {
    const products = await productController.getUserProducts(
      req.userData.id,
      req.userData.role
    );
    return res.status(200).json({
      success: true,
      message: 'products retrieved successfully',
      data: products,
    });
  } catch (err) {
    return res.status(412).send({
      success: false,
      message: err.message,
    });
  }
};

const fetchProductBids = async (req, res) => {
  try {
    const product = await productModel.findOne({ _id: req.params.id });
    if (
      req.userData.role === 'admin' ||
      req.userData.id === product.seller.toHexString()
    ) {
      const productBids = await bidController.fetchBids(
        product._id,
        product.currentAuction
      );
      return res.status(200).json({
        success: true,
        message: 'Bids retrieved successfully',
        data: productBids,
      });
    } else {
      return res.status(403).json({
        success: false,
        message: 'only admins and sellers can view bids',
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
  createBid,
  createAuction,
  updateUser,
  listProduct,
  getSellerProductReport,
  getUserProducts,
  fetchProductBids,
  getUsers,
  getUser,
};
