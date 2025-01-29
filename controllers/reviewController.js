const Review = require('../models/reviewModel');
const handlers = require('./handlers');

exports.createReviewBody = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = handlers.getAll(Review);
exports.getReview = handlers.getOne(Review);
exports.createReview = handlers.createOne(Review);
exports.updateReview = handlers.updateOne(Review);
exports.deleteReview = handlers.deleteOne(Review);
