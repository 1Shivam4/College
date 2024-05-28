const Product = require('../models/productModel');
const catchAsync = require('../utils/catchAsync');

// GET ALL THE PRODUCTS
exports.getProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find().populate('reviews');

  res.status(200).json({
    status: 'success',
    products: products,
  });
});

// CREATE A NEW PRODUCT
exports.createProduct = catchAsync(async (req, res, next) => {
  const storedProduct = await Product.findOne({ name: req.body.name });
  const product = await Product.create(req.body);

  if (storedProduct) {
    return next('Product already exists');
  }

  res.status(200).json({
    status: 'success',
    product,
  });
});

// GET A SINGLE PRODUCT
exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.product);

  res.status(200).json({
    status: 'success',
    product,
  });
});

// UPDATE A PRODUCT
exports.updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.product, req.body);

  res.status(200).json({
    status: 'success',
    product,
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  await Product.findByIdAndDelete(req.params.product);

  res.status(200).json({
    status: 'success',
    message: 'Product deleted successfully',
  });
});
