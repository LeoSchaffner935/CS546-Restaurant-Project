const userData = require('./users');
const restaurantData = require('./restaurants');
const reviewData = require('./reviews');
const commentData = require('./comments');

module.exports = {
  books: bookData,
  restaurants: restaurantData,
  reviews: reviewData,
  comments: commentData
};