const express = require("express");
const router = express.Router();

const {
  registerValidation,
  loginValidation,
} = require("../middleware/authValidation");
const { login, register, userProfile, users } = require("../controllers/auth");
const verifyToken = require("../middleware/auth");

router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.get("/profile/:id", verifyToken, userProfile);
router.get("/users", verifyToken, users);

module.exports = router;
