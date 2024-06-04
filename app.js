const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require('morgan');
const xss = require('xss-clean');
const passport = require('passport');
const session = require('express-session');
const flash = require('express-flash');
const compression = require('compression');
const cors = require('cors');

const productRoute = require('./routes/productsRoute.js');
const usersRoute = require('./routes/usersRoute.js');
const viewRoute = require('./routes/viewRoute.js');
const reviewRoute = require('./routes/reviewRoute.js');
const cartRoute = require('./routes/cartRoute.js');
const purchaseRoute = require('./routes/purchaseRoute.js');
const AppError = require('./utils/appError.js');

const globalErrorHandler = require('./controllers/errorHandlerController.js');

const app = express();

app.enable('trust proxy');

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(flash());
// set security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        'default-src': ["'self'"],
        'script-src': [
          "'self'",
          'https://checkout.razorpay.com/v1/checkout.js',
        ],
        'frame-src': ["'self'", 'https://api.razorpay.com/'], // Allow framing from Razorpay API domain
      },
    },
  })
);

//Body parser, reading data form the req body
app.use(express.json({ limit: '10kb' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.options('*', cors());

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Development Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limiting the request from the same
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});

app.use('/api', limiter);

// Sanitize against the NoSQL injection
app.use(mongoSanitize());

// Data sanitization from xss
app.use(xss());

app.use(compression());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

// API ROUTES
app.use('/api/v1/product', productRoute);
app.use('/api/v1/users', usersRoute);
app.use('/api/v1/review', reviewRoute);
app.use('/api/v1/cart', cartRoute);
app.use('/api/v1/payment', purchaseRoute);
// View ROUTES
app.use('/', viewRoute);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} is on this server!`, 404));
});

// GLOBAL ERROR HANDLING
app.use(globalErrorHandler);

module.exports = app;
