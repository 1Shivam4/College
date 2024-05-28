const express = require('express');
const userControllers = require('../controllers/usersController');

const router = express.Router();

router
  .route('/')
  .get(userControllers.getAllUsers)
  .post(userControllers.createNewUser);

router.route('/:id').get(userControllers.getUser);
// route.route('/:updateMe').patch(viewController.login, authController.updateMe);

module.exports = router;
