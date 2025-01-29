const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const CustomError = require('../utils/customError');
const handlers = require('./handlers');

const filterUnwantedFileds = (obj, ...fields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (fields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllUsers = handlers.getAll(User);

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined!, use the /signup route',
  });
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.getUser = handlers.getOne(User);

exports.updateMe = catchAsync(async (req, res, next) => {
  //Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new CustomError('This route is not for changing password!', 400),
    );

  //Filter out unwanted fields name that are not allowed
  const filtered = filterUnwantedFileds(req.body, 'name', 'email');

  //Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filtered, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.updateUser = handlers.updateOne(User);
exports.deleteUser = handlers.deleteOne(User);
