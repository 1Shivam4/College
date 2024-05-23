const Cart = require('../models/cartModel');
const catchAsync = require('../utils/catchAsync');

exports.createCartElement = catchAsync(async (req, res, next) => {
  if (req.isAuthenticated()) {
    const doc = await Cart.create(req.body);

    res.status(200).json({
      status: 'success',
      data: doc,
    });
  }
});

exports.getCartElement = catchAsync(async (req, res, next) => {
  const doc = await Cart.find({});

  res.status(200).json({
    status: 'success',
    doc,
  });
});

exports.deleteCartElement = catchAsync(async (req, res, next) => {
  await Cart.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: 'success',
  });
});
