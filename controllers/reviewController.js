const Review = require('../models/reviewModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: review,
  });
});

exports.getAllReviews = catchAsync(async (req, res, next) => {
  if (req.isAuthenticated()) {
    const review = await Review.find().populate('user');

    res.status(200).json({
      status: 'Success',
      data: review,
    });
  } else {
    res.status(401).json({
      status: 'failed',
      message: 'You are not logged in! Please log in first',
    });
  }
});
exports.createReview = catchAsync(async (req, res, next) => {
  if (req.isAuthenticated()) {
    const { productId, productSlug } = req.body;
    const currentUser = await User.findOne({ email: req.user.email })
      .populate('products')
      .populate('reviews');

    console.log('Product slug', productSlug);

    let hasPurchased = false;
    currentUser.products.forEach(function (data) {
      if (data.product._id.toString() === productId) {
        hasPurchased = true;
      }
    });

    if (!hasPurchased) {
      res.redirect(`/product/${productSlug}?alert="review-failed"`);
    }

    await Review.create({
      review: req.body.revie, // Corrected 'revie' to 'review'
      rating: req.body.rating,
      user: req.user._id,
      product: req.body.productId,
    });

    res.status(200).json({
      status: 'Success',
      message: 'Thank you for giving us a review',
      redirectUrl: `/product/${productSlug}`,
    });
    // res.redirect(`/product/${productSlug}/?alert="review-success"`);
  } else {
    res.status(401).json({
      status: 'failed',
      message: 'You are not logged in! Please log in first',
    });
  }
});

exports.updateReview = catchAsync(async (req, res, next) => {
  const updateReview = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updateReview)
    return next(new AppError('No doucment is find with this id', 404));

  res.status(200).json({
    status: 'success',
    data: updateReview,
  });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  if (req.isAuthenticated()) {
    const review = await Review.findOne({ user: req.user._id }).select('user');
    console.log(review);

    if (!review) return next(new AppError('You are not allowed to do this'));

    // await Review.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: 'success',
      data: review,
    });
  } else {
    res.status(401).json({
      status: 'failed',
      message: 'You are not logged in! Please login',
    });
  }
});
