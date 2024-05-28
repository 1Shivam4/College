const passport = require('passport');
const { Strategy } = require('passport-local');
const GoogleStrategy = require('passport-google-oauth2');
const bcrypt = require('bcrypt');

const catchAsync = require('../utils/catchAsync');
const User = require('../models/usersModel');
const AppError = require('../utils/appError');

const saltRounds = 10;

const filterObj = (obj, ...allowedFileds) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFileds.includes(obj)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.adminPanel = catchAsync(async (req, res, next) => {
  res.render('register.ejs');
});

exports.createAdmin = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const user = await User.findOne({ email: email });

  if (user) {
    res.redirect('/');
  } else {
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) {
        console.log('Error hashing Password', err);
      } else {
        const result = await User.create({
          name: name,
          email: email,
          password: hash,
          role: role,
        });

        req.login(result, (err) => {
          if (err) {
            console.log('failed');
          }
          console.log('success');
          res.redirect('/');
        });
      }
    });
  }
});

// Update Route was deleted from here

exports.adminLogin = catchAsync(async (req, res, next) => {
  req.login('/login');
});

exports.login = catchAsync(async (req, res, next) => {
  res.render('login.ejs');
});

exports.logout = catchAsync(async (req, res, next) => {
  req.logout((err) => {
    return err;
  });
  res.redirect('/?alert=loggedOut');
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permisson to perform this action', 403)
      );
    }
    next();
  };
};

// Local Strategy for admins
passport.use(
  new Strategy(
    catchAsync(async (username, password, cb) => {
      const user = await User.findOne({ email: username }).select('+password');

      if (user) {
        const storedHashedPassword = user.password;
        bcrypt.compare(password, storedHashedPassword, (err, valid) => {
          if (err) {
            return cb(err, { message: 'Error comparing messages' });
          } else if (valid) {
            // Passed password check
            console.log('Successfully logged in');
            return cb(null, user, {
              message: 'You have successfully logged in',
            });
          } else {
            // failed password check
            console.log('Wrong username or password');
            return cb(null, false, { message: 'Wrong username or password' });
          }
        });
      } else {
        console.log('Failed ');
        return cb('User not found');
      }
    })
  )
);

// Google Strategy for users
passport.use(
  'google',
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.CALLBACK_URL || `http://localhost:3000/auth/google/secrets`,
      userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        // console.log(profile);

        const result = await User.findOne({ email: profile.email });

        if (!result) {
          const newUser = await User.create({
            name: profile.displayName,
            email: profile.email,
            photo: profile.picture,
            password: 'google',
          });

          return cb(null, newUser);
        } else {
          return cb(null, result);
        }
      } catch (err) {
        // ALREADY EXISTS
        return cb(null, err);
      }
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});
passport.deserializeUser((user, cb) => {
  cb(null, user);
});
