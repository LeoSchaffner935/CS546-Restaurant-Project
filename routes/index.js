const userRoutes = require('./users');
const restaurantRoutes = require('./restaurants');
const searchRoutes = require('./search');
const loginRoutes = require('./login');

const constructorMethod = (app) => {
  app.use('/users', userRoutes);
  app.use('/restaurants', restaurantRoutes);
  app.use('/search', searchRoutes);
  app.use('/login', loginRoutes);

  app.get('/', (req, res) => {
    res.render('home');
  });
  
  app.get('/signup', (req, res) => {
    res.render('signup');
  });

  app.get("/private",(req,res) => {
    try {
        res.render("private", req.session.user);
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