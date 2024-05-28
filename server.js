const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');

process.on('uncaughtException', function (err) {
  console.log('UNCAUGHT EROOR! Shutting down... 💥💥💥');
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require('./app.js');

app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "script-src 'self' https://checkout.razorpay.com"
  );
  next();
});

const db = process.env.DATABASE;
mongoose.connect(db).then(() => {
  console.log('Connected to MongoDB');
});

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! Shutting down... 💥💥💥');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});
