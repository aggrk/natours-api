const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema(
  {
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Tour cannot be empty'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'User cannot be empty'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

favoriteSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'tour',
    select: 'name duration summary imageCover price startLocation',
  });
  next();
});

//restricting a user from leaving multiple reviews for the same tour
// favoriteSchema.index({ tour: 1, user: 1 }, { unique: true });

const Favorite = mongoose.model('Favorite', favoriteSchema);
module.exports = Favorite;
