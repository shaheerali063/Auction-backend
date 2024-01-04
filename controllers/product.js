const productModel = require('../models/product');
const auctionModel = require('../models/auction');
const bidModel = require('../models/bid');
const purchaseModel = require('../models/purchase');
const userModel = require('../models/user');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const { response } = require('express');

const getProducts = async (req, res) => {
  if (req.userData.role !== 'admin') {
    return res.status(401).send({
      message: 'You do not have permission to perform this action.',
    });
  }
  const products = await productModel.find().populate('currentAuction');
  console.log(req);

  return res.status(200).json({
    success: true,
    data: products.reverse(),
  });
  //.reverse() to get the latest data at first
};

const getProduct = async (req, res) => {
  const { id } = req.params;
  const product = await productModel
    .findOne({ _id: id })
    .populate('currentAuction');
  const seller = await userModel.findOne({ _id: product.seller });

  try {
    if (product) {
      return res.status(200).json({
        success: true,
        data: { product, seller },
      });
    }
  } catch (error) {
    return res.status(412).send({
      success: false,
      message: error.message,
    });
  }
};

const createProduct = async (req, res) => {
  if (req.userData.role === 'buyer') {
    return res.status(401).send({
      message: 'You do not have permission to perform this action.',
    });
  }
  const { seller, name, description, minimumBidAmount } = req.body;
  const uploader = async (path) => await cloudinary.uploads(path, 'Images');
  try {
    if (req.method === 'POST') {
      const urls = [];
      const files = req.files;
      if (files) {
        for (const file of files) {
          const { path } = file;
          const newPath = await uploader(path);
          urls.push(newPath);
          fs.unlinkSync(path);
        }
      }
      const product = await new productModel({
        seller: seller,
        name: name,
        description: description,
        minimumBidAmount: minimumBidAmount,
        status: 'available',
        images: urls,
      });
      product.save().then((response) => {
        return res.status(201).json({
          success: true,
          message: 'product created successfully',
          data: response,
        });
      });
    } else {
      return res.status(405).json({
        err: `${req.method} method not allowed`,
      });
    }
  } catch (error) {
    return res.status(412).send({
      success: false,
      message: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  const { seller, name, description, minimumBidAmount, status } = req.body;
  const { id } = req.params;
  let product = await productModel.findById(id);
  if (
    product.seller.toHexString() !== req.userData.id &&
    req.userData.role !== 'admin'
  ) {
    response.status(401).send({ message: 'Unauthorized User' });
  }
  const uploader = async (path) => await cloudinary.uploads(path, 'Images');

  try {
    if (product) {
      if (req.method === 'PUT') {
        const urls = [];
        const files = req.files;
        if (files) {
          for (const file of files) {
            const { path } = file;
            const newPath = await uploader(path);
            urls.push(newPath);
            fs.unlinkSync(path);
          }
        }
        product.updateOne(
          {
            $set: {
              seller: seller,
              name: name,
              description: description,
              minimumBidAmount: minimumBidAmount,
              status: status,
              images: urls,
            },
          },
          {},
          { new: true }
        );

        return res.status(201).json({
          success: true,
          message: 'product updated successfully',
          data: req.body,
        });
      } else {
        return res.status(405).json({
          err: `${req.method} method not allowed`,
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'product not found',
      });
    }
  } catch (error) {
    return res.status(412).send({
      success: false,
      message: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  const id = req.params.id;
  let product = await productModel.findById(id);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found.',
    });
  }
  if (
    product.seller.toHexString() !== req.userData.id &&
    req.userData.role !== 'admin'
  ) {
    res.status(401).send({ message: 'Unauthorized User' });
  }
  try {
    await bidModel.deleteMany({ product: id });
    await auctionModel.updateMany(
      { products: id },
      { $pull: { products: id } }
    );
    await productModel.deleteOne({ _id: id });
    return res.status(200).json({
      success: true,
      message: 'product deleted successfully.',
    });
  } catch (error) {
    return res.status(412).send({
      success: false,
      message: error.message,
    });
  }
};

const getLiveProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const skip = (page - 1) * pageSize;

    const liveProducts = await productModel.find({ status: 'live' });

    return res.status(200).json({
      success: true,
      data: liveProducts,
      message: 'Live products retrieved successfully.',
    });
  } catch (err) {
    return res.status(412).send({
      success: false,
      message: err.message,
    });
  }
};

// const getProductsReport = async (userId) => {
//   try {
//     const sellerProducts = await productModel.find({ seller: userId });
//     return sellerProducts;
//   } catch (err) {
//     console.error(err);
//     throw new Error('Unable to fetch seller products report.');
//   }
// };

const getUserProducts = async (userId, role) => {
  try {
    if (role === 'seller') {
      return await productModel
        .find({ seller: userId })
        .populate('currentAuction')
        .populate('seller')
        .populate('buyer');
    } else if (role === 'buyer') {
      return await purchaseModel.find({ buyer: userId });
    }
  } catch (err) {
    console.error(err);
    throw new Error('Unable to fetch products.');
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getLiveProducts,
  // getProductsReport,
  getUserProducts,
};
