const express = require('express');
const authController = require('../controllers/authController');
const {
  createFavorite,
  getAllFavorites,
  deleteFavorite,
} = require('../controllers/favoriteController');

const router = express.Router();

router
  .route('/')
  .get(authController.protect, getAllFavorites)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    createFavorite,
  );

router.route('/:id').delete(authController.protect, deleteFavorite);

module.exports = router;
