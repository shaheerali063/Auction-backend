var express = require("express");
var router = express.Router();
const productController = require("../controllers/product");
const { productValidator } = require("../middleware/validation-middleware");

router.get("/", productController.getProducts);
router.get("/show/:id", productController.getProduct);
router.post("/create", productValidator, productController.createProduct);
router.put("/update/:id", productValidator, productController.updateProduct);
router.delete("/delete/:id", productController.deleteProduct);

module.exports = router;
