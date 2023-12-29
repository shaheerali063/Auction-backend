const productModel = require("../models/product");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

const getProducts = async (req, res) => {
  const products = await productModel.find();

  return res.status(200).json({
    success: true,
    data: products.reverse(),
  });
  //.reverse() to get the latest data at first
};

const getProduct = async (req, res) => {
  const { id } = req.params;
  const product = await productModel.findOne({ _id: id });

  try {
    if (product) {
      return res.status(200).json({
        success: true,
        data: product,
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
  const { seller, name, description, minimumBidAmount, status } = req.body;
  const uploader = async (path) => await cloudinary.uploads(path, "Images");
  try {
    if (req.method === "POST") {
      const urls = [];
      const files = req.files;
      for (const file of files) {
        const { path } = file;
        const newPath = await uploader(path);
        urls.push(newPath);
        fs.unlinkSync(path);
      }
      const product = await new productModel({
        seller: seller,
        name: name,
        description: description,
        minimumBidAmount: minimumBidAmount,
        status: status,
        images: urls,
      });
      product.save();

      return res.status(201).json({
        success: true,
        message: "product created successfully",
        data: product,
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
  const { id } = req.params.id;
  let product = await productModel.findById(id);
  const uploader = async (path) => await cloudinary.uploads(path, "Images");

  try {
    if (product) {
      if (req.method === "PUT") {
        const urls = [];
        const files = req.files;
        for (const file of files) {
          const { path } = file;
          const newPath = await uploader(path);
          urls.push(newPath);
          fs.unlinkSync(path);
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
          message: "product updated sucessfully",
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
        message: "product not found",
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
  const { id } = req.params;

  try {
    await productModel.deleteOne({ _id: id });
    return res.status(410).json({
      success: true,
      message: "product deleted sucessfully",
    });
  } catch (error) {
    return res.status(412).send({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
