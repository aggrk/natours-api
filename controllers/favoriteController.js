const catchAsync = require('../utils/catchAsync');
const Favorite = require('../models/favoriteModel');
const handlers = require('./handlers');
const { createActivity } = require('./activityController');

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

exports.deleteFavorite = handlers.deleteOne(Favorite);
