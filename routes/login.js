const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;
const bcrypt = require("bcrypt");

router.get("/login", (req, res) => {
    res.render('login');
});

router.post("/login", async (req,res) => {
    if (!req.body.username || req.body.username.trim() == "") {
        res.status(401).render("login",{error:true});
      }
      if (!req.body.password || req.body.password.trim() == "") {
        res.status(401).render("login",{error:true});
      }
      const users = await userData.getAll();
      let passMatch = false;
      for (let i = 0; i < users.length; i++) {
          passMatch = await bcrypt.compare(req.body.password, users[i].hashedPassword);
          if (req.body.username === users[i].username && passMatch) {
              req.session.user = {
                  _id: users[i]._id,
                  username: users[i].username,
                  firstName: users[i].firstName,
                  lastName: users[i].lastName,
                  email: users[i].email,
                  bio: users[i].bio
              };
              res.redirect('/private');
              return;
          }
      }
      res.status(401).render("login",{error:true});
});

module.exports = router;