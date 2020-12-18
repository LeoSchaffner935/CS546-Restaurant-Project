const userRoutes = require('./users');
const restaurantRoutes = require('./restaurants');
const searchRoutes = require('./search');
const loginRoutes = require('./login');
const requestRRoutes = require('./requestR');

const constructorMethod = (app) => {
  app.use('/users', userRoutes);
  app.use('/restaurants', restaurantRoutes);
  app.use('/search', searchRoutes);
  app.use('/login', loginRoutes);
  app.use('/requestR', requestRRoutes);

  app.get('/', (req, res) => {
    res.render('home', {
      authenticated: req.session.user ? true : false
    });
  });
  
  app.get('/signup', (req, res) => {
    res.render('signup', {
      authenticated: req.session.user ? true : false
    });
  });

  app.get('/requestR', (req, res) => {
    res.render('requestRestaurant', {
      authenticated: req.session.user ? true : false
    });
  })

  app.get("/private",(req,res) => {
    try {
        res.render("private", {
          user: req.session.user,
          authenticated: req.session.user ? true : false
        });
    } catch(e) {
        res.sendStatus(500);
    }
  });

  app.get("/logout", (req,res) => {
    try{
        req.session.destroy();
        res.redirect("/");
    }catch(e){
        res.sendStatus(500);
    }
  });

  app.use('*', (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;