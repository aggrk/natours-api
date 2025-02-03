const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const CustomError = require('./utils/customError');
const errorHandler = require('./controllers/errorHandlerController');

const app = express();

//Global middlewares
app.use(cors());
//Rate limiting
app.set('trust proxy', 1);
const limiter = rateLimit({
  limit: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again after an hour',
  standardHeaders: true,
  legacyHeaders: false,
});

//Set security http headers
app.use(helmet());

//Data sanitization from NoSQL injection
app.use(mongoSanitize());

//Data sanitization from xss
app.use(xss());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '100kb' }));

app.use('/api', limiter);

//Preventing parameter polution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'price',
      'difficulty',
      'ratingsAverage',
    ],
  }),
);
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

//HANDLING UNMATCHED ROUTES
app.all('*', (req, res, next) => {
  const err = new CustomError(
    `Can't find ${req.originalUrl} on this server`,
    404,
  );

  //By passing an argument in the next function express will automatically call the error handling middleware
  next(err);
});

//ERROR HANDLING MIDDLEWARE
app.use(errorHandler);

module.exports = app;
