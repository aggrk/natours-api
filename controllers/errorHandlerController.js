const CustomError = require('../utils/customError');

const castErrorDB = (err) => {
  const message = `Invalid ID:${err.value}`;
  return new CustomError(message, 400);
};

const duplicateFieldError = (err) => {
  const value = err.errorResponse.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  const message = `Duplicate value:${value}, Please change the field value!`;
  return new CustomError(message, 400);
};

const validationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid inputs:${errors.join('. ')}`;
  return new CustomError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.log('ERROR 💥', err);
    res.status(500).json({
      status: 'error',
      message: 'Something is wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (err.name === 'CastError') error = castErrorDB(error);
    if (err.code === 11000) error = duplicateFieldError(error);
    if (err.name === 'ValidationError') error = validationError(error);
    sendErrorProd(error, res);
  }
};
