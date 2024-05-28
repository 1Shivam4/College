const mongoose = require('mongoose');
const validator = require('validator');
// const bcrypt = require('bcrypt');

const usersSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'User must have a name'],
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'A user must have an email'],
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    photo: {
      type: String,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'lead-manager', 'manager'],
      default: 'user',
    },
    password: {
      type: String,
      required: [true, 'Please provide a valid password'],
    },
    passwordConfirm: {
      type: String,
      require: [true, 'Please confirm your password'],
      validate: function (el) {
        return el === this.password;
      },
      message: 'Password are not same',
    },
    passwordChangedAt: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Make the review available for the user
usersSchema.virtual('reviews', {
  ref: 'review',
  foreignField: 'user',
  localField: '_id',
});

usersSchema.virtual('products', {
  ref: 'Purchase',
  foreignField: 'user',
  localField: '_id',
});

const User = mongoose.model('user', usersSchema);
module.exports = User;
