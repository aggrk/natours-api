const express = require('express');
const authController = require('../controllers/authController');
const { getActivities } = require('../controllers/activityController');

const router = express.Router();

router.route('/').get(authController.protect, getActivities);

module.exports = router;
