const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;
const reviewData = data.reviews;
const commentData = data.comments;
const bcrypt = require('bcrypt');
const emailValidator = require("email-validator");

router.get('/:username', async (req, res) => {
    try {
        // Check Format of Username
        const user = await userData.getByUsername(req.params.username.toLowerCase());

        let fullReviews = [];
        user.reviews.forEach(async r => {
            fullReviews.push(await reviewData.getReviewById(r));
        });

        let fullComments = [];
        user.comments.forEach(async c => {
            fullComments.push(await commentData.getCommentById(c));
        });

        res.render('user', {
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            bio: user.bio,
            reviews: fullReviews,
            comments: fullComments
        });
    } catch (e) {
        res.status(404).json({ error: 'User with given username not found' });
    }
});

router.post('/', async (req, res) => {
    try {
        if (!req.body) {
            res.status(400).json({ error: 'Data must be provided to signup' });
            return;
        }
        let user = req.body;
        if (!user.username || typeof user.username !== "string" || !user.username.trim()) {
            res.status(400).json({ error: 'username must be provided to signup' });
            return;
        }
        let existingUser;
        try {
            existingUser = await userData.getByUsername(user.username.toLowerCase());
        } catch (e) {
            console.log('username available');
        }
        if (existingUser) {
            // TODO select proper status
            res.status(403).json({ error: 'username already exists in the database' });
            return;
        }
        if (!user.firstName || typeof user.firstName !== "string" || !user.firstName.trim()) {
            res.status(400).json({ error: 'Invalid First Name' });
            return;
        }
        if (!user.lastName || typeof user.lastName !== "string" || !user.lastName.trim()) {
            res.status(400).json({ error: 'Invalid Last Name' });
            return;
        }
        if (!user.email || typeof user.email !== "string" || !user.email.trim()) {
            res.status(400).json({ error: 'Invalid Email' });
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
        user.reviews = [];
        user.comments = [];
        const savedUser = await userData.add(user);
        req.session.user = {
            _id: savedUser._id,
            username: savedUser.username,
            firstName: savedUser.firstName,
            lastName: savedUser.lastName,
            email: savedUser.email,
            bio: savedUser.bio
        };
        res.redirect('/restaurants');
    } catch (e) {
        res.status(400).json(e);
    }
});

router.put('/:id', async (req, res) => {
    try {
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
        let user = req.body;
        if (!user.username || typeof user.username !== "stirng" || !user.username.trim()) {
            res.status(400).json({ error: 'Invalid username!' });
            return;
        }
        if (!user.firstName || typeof user.firstName !== "stirng" || !user.firstName.trim()) {
            res.status(400).json({ error: 'Invalid firstName!' });
            return;
        }
        if (!user.lastName || typeof user.lastName !== "stirng" || !user.lastName.trim()) {
            res.status(400).json({ error: 'Invalid lastName!' });
            return;
        }
        if (!user.email || typeof user.email !== "stirng" || !user.email.trim()) {
            res.status(400).json({ error: 'Invalid email!' });
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

        const user = await userData.update(req.params.id, user);
        // check if we need this or redirect to /users/:id
        res.redirect('/private');
    } catch (e) {
        res.status(500).json({ error: 'Failed to update user!' });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        if (isNan(parseInt(req.params.id))) throw 'Routes/Users.js/patch: Id must be a number!';

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
    try {
        if (isNan(parseInt(req.params.id))) throw 'Routes/Users.js/delete: Id must be a number!';

        const user = await userData.delete(req.params.id);

        res.send("<h2>Account has successfully been deleted!</h2>");
    } catch (e) {
        res.status(400).json(e);
    }
});

module.exports = router;