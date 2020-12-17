const dbConnection = require('./mongoConnection');

const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

module.exports = {
  users: getCollectionFn('users'),
  restaurants: getCollectionFn('restaurants'),
  reviews: getCollectionFn('reviews'),
  comments: getCollectionFn('comments'),
  requestRestaurants: getCollectionFn('requestRestaurants')
};