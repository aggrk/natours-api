const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const handlers = require('./handlers');

exports.getTopCheap = (req, res, next) => {
  req.query.sort = '-ratingsAverage,price';
  req.query.limit = 5;
  req.query.fields = 'name,duration,maxGroupSize,price,summary';
  next();
};

exports.getAllTours = handlers.getAll(Tour);

exports.getTour = handlers.getOne(Tour, { path: 'reviews' });
exports.createTour = handlers.createOne(Tour);
exports.updateTour = handlers.updateOne(Tour);
exports.deleteTour = handlers.deleteOne(Tour);

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: {
        duration: {
          $gte: 10,
        },
      },
    },
    {
      $group: {
        _id: null,
        averagePrice: {
          $avg: '$price',
        },
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numOfTours: {
          $sum: 1,
        },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: {
        numOfTours: -1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});
