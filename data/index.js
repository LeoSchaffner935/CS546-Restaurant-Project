const userData = require('./users');
const restaurantData = require('./restaurants');
const reviewData = require('./reviews');
const commentData = require('./comments');
const requestRData = require('./requestRestaurants');

module.exports = {
  users: userData,
  restaurants: restaurantData,
  reviews: reviewData,
  comments: commentData,
  requestRestaurants: requestRData
};
