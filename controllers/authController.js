const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const CustomError = require('../utils/customError');
const sendEmail = require('../utils/email');

const secretToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });
};

const createAndSendToken = (user, statusCode, res) => {
  const token = secretToken(user._id);

  //Sending JWT via cookies
  const cookieOptions = {
    expire: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  });

  createAndSendToken(newUser, 201, res);
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

  createAndSendToken(user, 200, res);
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
  if (currentUser.checkPasswordChange(decoded.iat))
    return next(
      new CustomError(
        'User recently changed password! Please log in again!',
        401,
      ),
    );

  //Calling the next middleware
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new CustomError(
          'You do not have permission to perform this action!',
          403,
        ),
      );
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //Get user basing on posted email
  if (!req.body.email)
    return next(new CustomError('Please Enter the email', 400));
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return next(new CustomError('There is no user with that email', 404));

  //Generate the random token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //Send it to user's email
  const requestUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
  const message = `You requested a password reset link. Here it is: ${requestUrl}`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token (Expires in 10 minutes)',
      message,
    });
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new CustomError(
        'There was an error sending the email. Try again later!',
        500,
      ),
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordTokenExpire: { $gt: Date.now() },
  });

  //If token has not epired, and there is user, set the new password
  if (!user)
    return next(new CustomError('Invalid token or token expired!', 400));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordTokenExpire = undefined;
  await user.save();

  //Update passwordChangedAt by creating a middleware in the model

  //Login the user in, Send JWT
  createAndSendToken(user, 201, res);
});

exports.updateMyPassword = catchAsync(async (req, res, next) => {
  //Getting user from collection
  console.log(req.user);
  const user = await User.findById(req.user.id).select('+password');

  //Checking if POSTed current password is correct
  if (!(await user.comparePassword(req.body.passwordCurrent, user.password)))
    return next(new CustomError('Please enter a correct password!', 401));

  //Updating password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  //Login the user in, Send JWT
  createAndSendToken(user, 201, res);
});
