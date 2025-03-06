const catchAsync = require('../utils/catchAsync');
const Favorite = require('../models/favoriteModel');
// const handlers = require('./handlers');
const { createActivity } = require('./activityController');
const CustomError = require('../utils/customError');

exports.createFavorite = catchAsync(async (req, res, next) => {
  req.body.user = req.user.id;
  await createActivity(req.user.id, 'Added tour to favorites');
  const favorite = await Favorite.create(req.body);

  res.status(201).json({
    status: 'success',
    data: favorite,
  });
});

exports.getAllFavorites = catchAsync(async (req, res, next) => {
  const user = req.user.id;
  const favorites = await Favorite.find({ user });

  res.status(201).json({
    status: 'success',
    data: favorites,
  });
});

exports.deleteFavorite = catchAsync(async (req, res, next) => {
  const doc = await Favorite.findByIdAndDelete(req.params.id);

  if (!doc) return next(new CustomError('No document with that ID', 404));
  await createActivity(req.user.id, 'Deleted a tour from favorites');
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
