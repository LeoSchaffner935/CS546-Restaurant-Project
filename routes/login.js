const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;
const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
    res.render('login');
});

router.post("/", async (req, res) => {
    if (!req.body) {
        res.status(404).render("login", { error: true });
        return;
    }
    let loginInfo = req.body;
    if (!loginInfo.username || typeof loginInfo.username !== "string" || !loginInfo.username.trim()) {
        res.status(400).render("login", { error: true });
        return;
    }
    loginInfo.username = loginInfo.username.trim().toLowerCase();
    if (!loginInfo.password || typeof loginInfo.password !== "string" || !loginInfo.password.trim()) {
        res.status(400).render("login", { error: true });
        return;
    }
    let user;
    try {
        user = await userData.getByUsername(loginInfo.username);
    } catch (e) {
        res.status(404).render("login", { error: true });
        return;
    }
    if (!await bcrypt.compare(req.body.password, user.hashedPassword)) {
        res.status(401).render("login", { error: true });
        return;
    }
    req.session.user = {
        _id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        bio: user.bio
    };
    res.redirect('/restaurants');
    return;
});

module.exports = router;