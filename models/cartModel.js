const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A product should have a name'],
  },
  price: {
    type: Number,
    required: [true, 'A product should have a price'],
  },
  description: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
  },
  imageCover: {
    type: String,
  },
  category: {
    type: String,
    required: true,
    enum: ['applications', 'electronics', 'food'],
  },
  slug: {
    type: String,
  },
  ratingAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must above 1'],
    max: [5, 'Rating must be below 5.0'],
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'user',
    required: [true, 'cart must belong to a user'],
  },
});

cartSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

const Cart = mongoose.model('cart', cartSchema);

module.exports = Cart;
