const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;
const reviewData = data.reviews;
const commentData = data.comments;
const bcrypt = require('bcrypt');
const emailValidator = require("email-validator");

router.get('/:username', async (req, res) => {
    if (!req.params.username) {
        res.status(400).json({ error: 'Username cannot be empty' });
        return;
    }
    let user;
    try {
        user = await userData.getByUsername(req.params.username.toLowerCase());
    } catch (e) {
        res.status(404).json({ error: 'User not found!' });
        return;
    }
    if (user.isDeleted) {
        res.status(404).json({ error: 'This user has deleted their account!' });
        return;
    }
    let fullReviews = [];
    console.log(user.reviews);
    user.reviews.forEach(async r => {
        fullReviews.push(await reviewData.getReviewById(r));
    });
    console.log(fullReviews);
    user.reviews = fullReviews;

    let fullComments = [];
    user.comments.forEach(async c => {
        fullComments.push(await commentData.getCommentById(c));
    });
    user.comments = fullComments;

    res.render('user', {
        user: user
    });
});

router.post('/', async (req, res) => {
    if (!req.body) {
        res.status(400).json({ error: 'Data must be provided to signup' });
        return;
    }
    let user = req.body;
    if (!user.username || typeof user.username !== "string" || !user.username.trim()) {
        res.status(400).json({ error: 'username must be provided to signup' });
        return;
    }
    user.username = user.username.trim().toLowerCase();
    let existingUsername;
    try {
        existingUsername = await userData.getByUsername(user.username);
    } catch (e) {
        console.log('username available');
    }
    if (existingUsername) {
        // TODO select proper status
        res.status(403).json({ error: 'username already exists in the database' });
        return;
    }
    if (!user.firstName || typeof user.firstName !== "string" || !user.firstName.trim()) {
        res.status(400).json({ error: 'Invalid First Name' });
        return;
    }
    user.firstName = user.firstName.trim();
    if (!user.lastName || typeof user.lastName !== "string" || !user.lastName.trim()) {
        res.status(400).json({ error: 'Invalid Last Name' });
        return;
    }
    user.lastName = user.lastName.trim();
    if (!user.email || typeof user.email !== "string" || !user.email.trim()) {
        res.status(400).json({ error: 'Invalid Email' });
        return;
    }
    user.email = user.email.trim().toLowerCase();
    let existingEmail;
    try {
        existingEmail = await userData.getByEmail(user.email);
    } catch (e) {
        console.log('username available');
    }
    if (existingEmail) {
        // TODO select proper status
        res.status(403).json({ error: 'email already exists in the database' });
        return;
    }
    if (!user.password || typeof user.password !== "string" || !user.password.trim()) {
        res.status(400).json({ error: 'Invalid Password' });
        return;
    }
    if (!user.bio || typeof user.bio !== "string" || !user.bio.trim()) {
        res.status(400).json({ error: 'Invalid Bio' });
        return;
    }
    // TODO how does this work?
    if (!emailValidator.validate(user.email)) {
        res.status(400).json({ error: 'Invalid Email' });
        return;
    }
    user.hashedPassword = await bcrypt.hash(user.password, 16); // Hash Password
    delete user.password;
    user.reviews = [];
    user.comments = [];
    user = await userData.add(user);
    req.session.user = {
        _id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        bio: user.bio
    };
    res.redirect('/restaurants');
});

router.put('/:id', async (req, res) => {
    if (!req.params.id) {
        res.status(400).json({ error: 'id is required in the path' });
        return;
    }
    if (req.params.id !== req.session.user._id) {
        res.status(403).json({ error: 'Not allowed to edit other users!' });
    }
    if (!req.body) {
        res.status(400).json({ error: 'Data must be provided to update user!' });
        return;
    }
    let user;
    try {
        user = await userData.getById(req.params.id);
    } catch (e) {
        res.status(404).json({ error: 'User not found!' });
        return;
    }
    if (user.isDeleted) {
        res.status(404).json({ error: 'This user has deleted their account!' });
        return;
    }
    let user = req.body;
    if (!user.username || typeof user.username !== "stirng" || !user.username.trim()) {
        res.status(400).json({ error: 'Invalid username!' });
        return;
    }
    user.username = user.username.trim().toLowerCase();;
    let existingUsername;
    try {
        existingUsername = await userData.getByUsername(user.username);
    } catch (e) {
        console.log('username in database');
    }
    if (existingUsername && existingUsername._id !== req.params.id) {
        res.status(400).json({ error: 'username already associated with another user!' });
        return;
    }
    if (!user.firstName || typeof user.firstName !== "stirng" || !user.firstName.trim()) {
        res.status(400).json({ error: 'Invalid firstName!' });
        return;
    }
    user.firstName = user.firstName.trim();
    if (!user.lastName || typeof user.lastName !== "stirng" || !user.lastName.trim()) {
        res.status(400).json({ error: 'Invalid lastName!' });
        return;
    }
    user.lastName = user.lastName.trim();
    if (!user.email || typeof user.email !== "stirng" || !user.email.trim()) {
        res.status(400).json({ error: 'Invalid email!' });
        return;
    }
    user.email = user.email.trim().toLowerCase();
    let existingEmail;
    try {
        existingEmail = await userData.getByEmail(user.email);
    } catch (e) {
        console.log('username in database');
    }
    if (existingEmail && existingEmail.email !== user.email) {
        res.status(400).json({ error: 'email already associated with another user!' });
        return;
    }
    if (!user.password || typeof user.password !== "stirng" || !user.password.trim()) {
        res.status(400).json({ error: 'Invalid password!' });
        return;
    }
    if (!user.bio || typeof user.bio !== "stirng" || !user.bio.trim()) {
        res.status(400).json({ error: 'Invalid bio!' });
        return;
    }
    // how does this work?
    if (!emailValidator.validate(email)) {
        res.status(400).json({ error: 'Invalid email!' });
        return;
    }
    user.hashedPassword = await bcrypt.hash(user.password, 16);
    delete user.password;
    user = await userData.update(req.params.id, user);
    req.session.user = {
        _id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        bio: user.bio
    };
    res.redirect('/user/' + user.username);
});

router.patch('/:id', async (req, res) => {
    try {
        if (!req.params.id) {
            res.status(400).json({ error: 'id must be provided to patch user fields!' });
            return;
        }
        let user;
        try {
            user = await userData.getByUsername(req.params.username.toLowerCase());
        } catch (e) {
            res.status(404).json({ error: 'User not found!' });
            return;
        }
        if (user.isDeleted) {
            res.status(404).json({ error: 'This user has deleted their account!' });
            return;
        }

        if (!req.body) throw 'Routes/Users.js/post: You must provide data to create a user!';
        let updatedObject = {};
        const oldUser = await userData.getById(req.params.id);

        if (req.body.username && req.body.username !== oldUser.username) {
            if (!req.body.username.trim()) throw 'Routes/Users.js/patch: Username cannot be empty!';
            updatedObject.username = req.body.username;
        }
        if (req.body.firstName && req.body.firstName !== oldUser.firstName) {
            if (!req.body.firstName.trim()) throw 'Routes/Users.js/patch: FirstName cannot be empty!';
            updatedObject.firstName = req.body.firstName;
        }
        if (req.body.lastName && req.body.lastName !== oldUser.lastName) {
            if (!req.body.lastName.trim()) throw 'Routes/Users.js/patch: LastName cannot be empty!';
            updatedObject.lastName = req.body.lastName;
        }
        if (req.body.email && req.body.email !== oldUser.email) {
            if (!req.body.email.trim()) throw 'Routes/Users.js/patch: Email cannot be empty!';
            if (!emailValidator.validate(req.body.email)) throw "Routes/Users.js/patch: Email must be valid!";
            updatedObject.email = req.body.email;
        }
        if (req.body.bio && req.body.bio !== oldUser.bio) {
            if (!req.body.bio.trim()) throw 'Routes/Users.js/patch: Bio cannot be empty!';
            updatedObject.bio = req.body.bio;
        }
        const bcryptBool = bcrypt.compare(req.body.password, oldUser.hashedPassword)
        if (req.body.password && !bcryptBool) {
            if (!req.body.password.trim()) throw 'Routes/Users.js/patch: Password cannot be empty!';
            updatedObject.hashedPassword = await bcrypt.hash(req.body.password, 16);
        }

        const user = await userData.update(req.params.id, updatedObject);

        res.redirect('/private');
    } catch (e) {
        res.status(400).json(e);
    }
});

router.delete('/:id', async (req, res) => {
    if (!req.params.id) {
        res.status(400).json({ error: 'id must be passed in the path!' });
        return;
    }
    if (req.params.id !== req.session.user._id) {
        // TODO proper status code
        res.status(403).json({ error: 'Cannot delete other users!' });
        return;
    }
    let user;
    try {
        user = await userData.getByUsername(req.params.username.toLowerCase());
    } catch (e) {
        res.status(404).json({ error: 'User not found!' });
        return;
    }
    if (user.isDeleted) {
        res.status(404).json({ error: 'This user has already deleted their account!' });
        return;
    }
    user.isDeleted = true;
    try {
        user = userData.update(req.params.id, user);
    } catch (e) {
        res.status(404).json({ error: 'User could not be deleted!' });
        return;
    }
    res.send("<h2>Account has successfully been deleted!</h2>");
});

module.exports = router;