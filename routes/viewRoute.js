const express = require('express');
const passport = require('passport');

const authController = require('../controllers/authController');
const viewController = require('../controllers/viewController');

const route = express.Router();

route.get('/', viewController.overview, viewController.userData);

route.route('/product/:slug').get(viewController.productOverview);

route.route('/product/:slug/:id').get(viewController.createCart);

route.route('/cart').get(viewController.getCart);

route.get('/login', authController.login);

route.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
  })
);

route.get('/logout', authController.logout);

route
  .route('/register')
  .get(authController.adminPanel)
  .post(authController.createAdmin);

route.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

route.get(
  '/auth/google/secrets',
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/login',
  })
);

module.exports = route;
