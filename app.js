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
    name:"AuthCookie",
    secret:"secretcookiedontbiteit",
    resave:false,
    saveUninitialized:true,
    //cookie max age?
    cookie: { maxAge: 100000 }
    })
);

app.use('/private', (req, res, next) => {
    if (!req.session.user) return res.status(403).redirect('/login',{
      error: 'Unauthorized!'
    });
    else next();
});

app.use('/users', (req, res, next) => {
  try {
    if (!req.body) throw 'app/users: You must provide a request body to edit your information';
    const user = req.body;
    if (!user.username || typeof user.username !== "string" || !user.username.trim()) throw 'app/users: username must be provided to signup';
    const existingUser = await userData.getByUsername(user.username.toLowerCase());
    if (existingUser) throw 'app/users: username already exists in the database';
    if (!user.firstName || typeof user.firstName !== "string" || !user.firstName.trim()) throw 'apps/users: Invalid First Name';
    if (!user.lastName || typeof user.lastName !== "string" || !user.lastName.trim()) throw 'app/users: Invalid Last Name';
    if (!user.email || typeof user.email !== "string" || !user.email.trim() || !emailValidator.validate(user.email)) throw 'app/users: Invalid Email';
    if (!user.bio || typeof user.bio !== "string" || !user.bio.trim()) throw 'app/users: Invalid Bio';
  } catch (e) {
    res.status(400).json({ error: e });
  }
  
  if (hiddenInput) req.method = "PUT";
  else next();
});

configRoutes(app);
app.listen(3000, () => {
  console.log("Server On!");
  console.log('http://localhost:3000');
});