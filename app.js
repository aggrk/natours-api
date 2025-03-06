const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const favoriteRouter = require('./routes/favoriteRoutes');
const activityRouter = require('./routes/activityRoutes');
const CustomError = require('./utils/customError');
const errorHandler = require('./controllers/errorHandlerController');

const app = express();

app.use(cookieParser());

//Global middlewares
app.use(
  cors({
    // origin: '*',
    origin: [
      'http://127.0.0.1:5173',
      'http://localhost:5173',
      'http://192.168.1.114:8081',
      'http://localhost:8081',
      'https://natours-aggr.netlify.app',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.options('*', cors());

//Set security http headers
app.use(helmet({ crossOriginResourcePolicy: false }));

//Data sanitization from NoSQL injection
app.use(mongoSanitize());

//Data sanitization from xss
app.use(xss());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '100kb' }));
app.use(express.static('public'));

//Rate limiting
app.set('trust proxy', 1);
const limiter = rateLimit({
  limit: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again after an hour',
  standardHeaders: true,
  legacyHeaders: false,
});

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
app.use('/api/v1/favorites', favoriteRouter);
app.use('/api/v1/activities', activityRouter);

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
