const { rawListeners } = require('../models/purchaseModel');
const User = require('../models/usersModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getUser = catchAsync(async (req, res, next) => {
  if (req.isAuthenticated()) {
    const user = await User.findById(req.params.id)
      .select('-password -role -__v')
      .populate({ path: 'reviews', select: '-user -createdAt -__v' })
      .populate({ path: 'products', select: 'user' });

    res.status(200).json({
      success: 'Success',
      user,
    });
  }
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.role === 'admin') {
      const users = await User.find({})
        .select('-password -role -__v')
        .populate({
          path: 'reviews',
          select: '-user  -createdAt -__v',
        });

      res.status(200).json({
        status: 'Success',
        users,
      });
    } else {
      return new AppError('unauthorized  access', 403);
    }
  } else {
    res.status(401).json({
      status: 'failed',
      message: 'You are not logged in. Please login first',
    });
  }
});

exports.createNewUser = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    next(new AppError('User Already exists', 409));
  }

  const newUser = await User.create(req.body);

  res.status(200).json({
    status: 'Success',
    newUser,
  });
});
