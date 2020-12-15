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
    saveUninitialized:true
    //cookie max age?
    })
);

app.use('/private', (req, res, next) => {
    if (!req.session.user) return res.status(403).redirect('/login',{
      error: 'Unauthorized!'
    });
    else next();
});

configRoutes(app);
app.listen(3000, () => {
  console.log("Server On!");
  console.log('http://localhost:3000');
});