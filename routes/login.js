const express = require("express");
const router = express.Router();
const data = require('../data');
const users = data.users;
const bcrypt = require("bcrypt");
const saltRounds = 16;

router.post("/login", async (req,res) => {
    if (!req.body.username || req.body.username.trim() == "") {
        res.status(401).render("Login",{error:true});
      }
      if (!req.body.password || req.body.password.trim() == "") {
        res.status(401).render("Login",{error:true});
      }
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
                  hashedPassword: users[i].hashedPassword,
                  bio: users[i].bio,
                  profilePic: users[i].profilePic
              };
              res.redirect('http://localhost:3000/private');
              return;
          }
      }
      res.status(401).render("Login",{error:true});
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
        res.render("Main");
    }catch(e){
        res.sendStatus(500);
    }
});