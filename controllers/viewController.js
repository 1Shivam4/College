const Cart = require('../models/cartModel');

const Product = require('../models/productModel');
const catchAsync = require('../utils/catchAsync');

exports.alert = (req, res, next) => {
  const { alerts } = req.query;
};
exports.overview = catchAsync(async (req, res, next) => {
  const data = await Product.find();

  let user = null;
  if (req.isAuthenticated()) {
    user = req.user;
  }

  res.render('home.ejs', { data: data, user: user });
});

exports.productOverview = catchAsync(async (req, res, next) => {
  const data = await Product.findOne({ slug: req.params.slug }).populate(
    'reviews'
  );

  res.render('product.ejs', { data: data, user: req.user });
});

exports.userData = catchAsync(async (req, res, next) => {
  let user = null;
  if (req.isAuthenticated()) {
    user = req.user;
  }
  res.status(200).render('partials/header.ejs', { user });
});

exports.createCart = catchAsync(async (req, res, next) => {
  if (req.isAuthenticated()) {
    const data = await Product.findOne({ _id: req.params.id });
    const cartData = await Cart.findOne({ user: req.user._id });

    if (cartData) {
      res.redirect('/?alert=failure');
    }

    await Cart.create({
      name: data.name,
      price: data.price,
      description: data.description,
      images: data.images,
      imageCover: data.imageCover,
      category: data.category,
      slug: data.slug,
      ratingAverage: data.ratingAverage,
      ratingsQuantity: data.ratingsQuantity,
      user: req.user._id,
    });

    // Redirect the user after successfully creating the cart item
    return res.redirect('/?alert=success');
  } else {
    // Redirect the user to the login page if not authenticated
    return res.redirect('/login?alert=not-loggedIn');
  }
});

exports.getCart = catchAsync(async (req, res, next) => {
  if (req.isAuthenticated()) {
    const cart = await Cart.find({ user: req.user._id });
    let user = null;
    if (req.isAuthenticated()) {
      user = req.user;
    }
    res.status(200).render('cart.ejs', { data: cart, user: user });
  } else {
    res.redirect('/login?alert=not-loggedIn');
  }
});

exports.login = (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({
      status: 'success',
      message: req.user,
    });
  } else {
    res.status(401).json({
      status: 'failed',
      message: 'You are not logged In! Please login first',
    });
  }
};
