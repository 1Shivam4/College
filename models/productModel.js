const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema(
  {
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

productSchema.virtual('reviews', {
  ref: 'review',
  foreignField: 'product',
  localField: '_id',
});

const Product = mongoose.model('product', productSchema);

module.exports = Product;
