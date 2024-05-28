const express = require('express');
const purchaseController = require('../controllers/purchaseController');

const router = express.Router();

router.route('/order/:productId').post(purchaseController.createPayment);
router.route('/verify/:productId').post(purchaseController.verifyPayment);

router.route('/').get(purchaseController.getPurchase);

module.exports = router;
