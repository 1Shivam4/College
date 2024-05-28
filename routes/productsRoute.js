const express = require('express');
const productController = require('../controllers/productController.js');
const authController = require('../controllers/authController.js');

const router = express.Router();

router
  .route('/')
  .get(productController.getProducts)
  .post(productController.createProduct);

router
  .route('/:product')
  .get(productController.getProduct)
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

module.exports = router;
