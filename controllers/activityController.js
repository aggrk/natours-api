const Activity = require('../models/activityModel');
const catchAsync = require('../utils/catchAsync');

exports.createActivity = async (userId, action, details = {}) => {
  await Activity.create({ user: userId, action, details });
};

exports.getActivities = catchAsync(async (req, res, next) => {
  const activities = await Activity.find({ user: req.user.id }).sort(
    'timestamp',
  );

  res.status(200).json({
    status: 'success',
    data: activities,
  });
});
