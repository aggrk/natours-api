const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const CustomError = require('./utils/customError');
const errorHandler = require('./controllers/errorHandlerController');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

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
