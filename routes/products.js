var express = require("express");
var router = express.Router();
const productController = require("../controllers/product");
const { productValidator } = require("../middleware/validation-middleware");
const upload = require("../config/multer");
const verifyToken = require("../middleware/auth");

router.get("/", verifyToken, productController.getProducts);
router.get("/show/:id", verifyToken, productController.getProduct);
router.post(
  "/create",
  verifyToken,
  upload.array("files", 10),
  productValidator,
  productController.createProduct
);
router.put(
  "/update/:id",
  verifyToken,
  upload.array("files", 10),
  productValidator,
  productController.updateProduct
);
router.delete("/delete/:id", verifyToken, productController.deleteProduct);

module.exports = router;
