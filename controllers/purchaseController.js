const crypto = require('crypto');
const Razorpay = require('razorpay');
const catchAsync = require('../utils/catchAsync');
const Product = require('../models/productModel');
const Purchase = require('../models/purchaseModel');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_ID, // Replace with your Razorpay key ID
  key_secret: process.env.RAZORPAY_SECRET, // Replace with your Razorpay key secret
});

exports.createPayment = catchAsync(async (req, res, next) => {
  const foundProduct = await Product.findById(req.params.productId);

  if (!foundProduct) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const options = {
    amount: foundProduct.price * 100, // amount in the smallest currency unit
    currency: 'INR',
    notes: { name: foundProduct.name },
  };

  const order = await razorpay.orders.create(options);

  res.status(200).json({
    success: true,
    order,
  });
});

exports.verifyPayment = catchAsync(async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const user = req.user;
  const product = req.params.productId;

  if (!user && !req.params.productId) return next();
  const purchase = await Purchase.create({
    user,
    product,
  });

  // Perform signature verification
  const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET);
  hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
  const generateSignature = hmac.digest('hex');

  if (generateSignature === razorpay_signature) {
    // Payment verification successful
    res.status(200).json({
      message: 'Payment verification successful',
      user: user,
    });
  } else {
    // Payment verification failed
    res.status(400).json({
      message: 'Payment verification failed',
    });
  }
});
exports.getPurchase = catchAsync(async (req, res, next) => {
  const products = await Purchase.find();

  res.status(200).json({
    status: 'Success',
    products,
  });
});
