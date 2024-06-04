const multer = require('multer');
const sharpe = require('sharp');

const Product = require('../models/productModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an Image! Please upload only images ', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 5 },
]);

exports.resizeProductImages = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) return next();

  //1. Image Cover
  req.body.imageCover = `/product-${Date.now()}-coverImage.jpg`;
  await sharpe(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .jpeg({ quality: 85 })
    .png({ quality: 85 })
    .toFile(`public/img/product/${req.body.imageCover}`);

  // 2. All the other images
  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `/product-${Date.now()}-${i + 1}.jpg`;

      await sharpe(file.buffer)
        .resize(2000, 1333)
        .jpeg({ quality: 85 })
        .png({ quality: 85 })
        .toFile(`public/img/product/${filename}`);

      req.body.images.push(filename);
    })
  );
  next();
});

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

  if (storedProduct) {
    return next(new AppError('Product already exists', 400));
  }

  const product = await Product.create(req.body);

  res.status(201).json({
    status: 'success',
    data: product,
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
