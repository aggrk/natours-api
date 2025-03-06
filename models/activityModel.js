const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  details: { type: Object },
  timestamp: { type: Date, default: Date.now() },
});

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
