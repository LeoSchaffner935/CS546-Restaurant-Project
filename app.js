const emailValidator = require('email-validator');
const userData = require('./data/users');

const express = require('express');
const app = express();
const configRoutes = require('./routes');
const session = require('express-session');
const exphbs = require('express-handlebars');

app.use('/public', express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(session({
  name: "AuthCookie",
  secret: "secretcookiedontbiteit",
  resave: false,
  saveUninitialized: true,
  //cookie max age?
  cookie: { maxAge: 100000 }
})
);

app.use('/private', (req, res, next) => {
  // if (!req.session.user) return res.status(403).redirect('/login', {
  //   error: 'Unauthorized!'
  // });
  if (!req.session.user) return res.redirect('/login');
  else next();
});

app.use('/requestR', (req, res, next) => {
  if (!req.session.user) return res.redirect('/login');
  else next();
});

app.use('/users/:username', (req, res, next) => {
  if (!req.session.user) return res.redirect('/login');
  else next();
});

app.use('/restaurants/:id/reviews', (req, res, next) => {
  if (!req.session.user) return res.redirect('/login');
  else next();
});

app.use('/restaurants/:id/reviews/:reviewId', (req, res, next) => {
  if (!req.session.user) return res.redirect('/login');
  else next();
});

app.use('/restaurants/:restaurantId/reviews/:reviewId/comments', (req, res, next) => {
  if (!req.session.user) return res.redirect('/login');
  else next();
});

app.use('/restaurants/:id/reviews', (req, res, next) => {
  if (!req.session.user) return res.redirect('/login');
  else next();
});

app.use('/users/:id', (req, res, next) => {
  if (req.method == 'POST') {
    if (!req.body) {
      res.status(400).json({ error: e });
      return;
    }
    if (req.body.hiddenInput) {
      req.method = 'PUT';
      next();
    }
    else next();
  }
  else next();
});

configRoutes(app);
app.listen(3000, () => {
  console.log("Server On!");
  console.log('http://localhost:3000');
});