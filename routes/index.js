const userRoutes = require('./users');
const restaurantRoutes = require('./restaurants');
const serachRoutes = require('./search');

const constructorMethod = (app) => {
  app.use('/users', userRoutes);
  app.use('/restaurants', restaurantRoutes);
  app.use('/search', serachRoutes);

  app.get('/', (req, res) => {
    res.render('home');
  });
  
  app.get('/signup', (req, res) => {
    res.render('signup');
  });

  router.get("/private",(req,res) => {
    try{
        let user = currentUser(req.session.id);
        let {_id, username, firstName, lastName, email, hashedPassword, bio, profilePic} = user;
        res.render("Private",{"username":username, "firstName":firstName, "lastName":lastName,"email":email, "bio":bio, "profilePic":profilePic});
    }catch(e){
        res.sendStatus(500);
    }
  });

  router.get("/logout", (req,res) => {
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