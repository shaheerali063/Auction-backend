const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const verifyToken = require('../middleware/auth');

router.post('/add-admin', verifyToken, adminController.inviteAdmin);
router.post(
  '/approve-auction/:id',
  verifyToken,
  adminController.approveAuction
);

module.exports = router;
