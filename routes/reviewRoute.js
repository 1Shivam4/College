const express = require('express');
const reviewController = require('../controllers/reviewController');

const route = express.Router();

route
  .route('/')
  .get(reviewController.getAllReviews)
  .post(reviewController.createReview);

route
  .route('/:id')
  .get(reviewController.getReview)
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);

module.exports = route;
