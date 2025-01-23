const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const CustomError = require('../utils/customError');

const secretToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
  });

  const token = secretToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  //checking if the email and password exists
  const { email, password } = req.body;
  if (!email || !password)
    return next(new CustomError('Email and Password should be filled!', 401));

  //Cheking if the user exists and if the password is correct
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password, user.password)))
    return next(new CustomError('Wrong email or password', 401));

  //Creating a token
  const token = secretToken(user.id);

  //Sending response
  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  //Getting token and checking if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token)
    return next(new CustomError('You are not logged in. Please login!', 401));

  //Verifying the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser)
    return next(new CustomError('There is no user with that token', 401));

  //Check if user changed password after token was issued
  if (currentUser.checkToken(decoded.iat))
    return next(
      new CustomError(
        'The user changed their password, please login again!',
        401,
      ),
    );

  //Calling the next middleware
  req.user = currentUser;
  next();
});
