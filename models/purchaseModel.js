const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'product',
    required: [true, 'Review must belong to a product'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'user',
    required: [true, 'Review must belong to a user'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean,
    default: true,
  },
});

// Define a pre-find hook to populate 'product' and 'user' fields
purchaseSchema.pre(/^find/, function (next) {
  this.populate({ path: 'user' }).populate({ path: 'product' });
  next();
});

const Purchase = mongoose.model('Purchase', purchaseSchema);

module.exports = Purchase;
