const express = require('express');
const cartController = require('../controllers/cartController');

const router = express.Router();

router
  .route('/')
  .get(cartController.getCartElement)
  .post(cartController.createCartElement);

module.exports = router;
