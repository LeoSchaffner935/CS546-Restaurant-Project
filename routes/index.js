const userRoutes = require('./users');
const restaurantRoutes = require('./restaurants');
const serachRoutes = require('./search');
const privateRoutes = require('./private');
const loginRoutes = require('./login');

const constructorMethod = (app) => {
  app.use('/users', userRoutes);
  app.use('/restaurants', restaurantRoutes);
  app.use('/search', serachRoutes);
  app.use('/private', privateRoutes);
  app.use('/login', loginRoutes);

  app.use('*', (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;