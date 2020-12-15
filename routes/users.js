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
        const user = await userData.getByUsername(req.params.username);

        let fullReviews = [];
        user.reviews.forEach(async r => {
            fullReviews.append(await reviewData.getReviewById(r));
        });

        let fullComments = [];
        user.comments.forEach(async c => {
            fullComments.append(await commentData.getCommentById(c));
        });

        res.render('user', {
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            bio: user.bio,
            reviews: fullReviews,
            comments: fullComments
        });
    } catch(e) {
        res.status(404).json(e);
    }
});

router.post('/', async (req, res) => {
    try {
        if (!req.body) throw 'Routes/Users.js/post: You must provide data to create a user!';
        if (!req.body.username || !req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password || !req.body.bio) throw 'Routes/Users.js/post: Missing Input Field!';

        if (!req.body.username.trim()) throw "Routes/Users.js/post: Username cannot be empty!";
        if (!req.body.firstName.trim()) throw "Routes/Users.js/post: FirstName cannot be empty!";
        if (!req.body.lastName.trim()) throw "Routes/Users.js/post: LastName cannot be empty!";
        if (!req.body.email.trim()) throw "Routes/Users.js/post: Email cannot be empty!";
        if (!req.body.password.trim()) throw "Routes/Users.js/post: Password cannot be empty!";
        if (!req.body.bio.trim()) throw "Routes/Users.js/post: Bio cannot be empty!";

        if (!emailValidator.validate(req.body.email)) throw "Routes/Users.js/post: Email must be valid!"; // Validate Email

        const hashedPassword = await bcrypt.hash(plainTextPassword, 16); // Hash Password

        const user = await userData.add(req.body.username, req.body.firstName, req.body.lastName, req.body.email.toLowerCase(), hashedPassword, req.body.bio);

        res.redirect('/private');
    } catch(e) {
        res.status(400).json(e);
    }
});

router.put('/:id', async (req, res) => {
    try {
        if (isNan(parseInt(req.params.id))) throw 'Routes/Users.js/put: Id must be a number!';
        
        if (!req.body) throw 'Routes/Users.js/put: You must provide data to update a user!';
        if (!req.body.username || !req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password || !req.body.bio) throw 'Routes/Users.js/put: Missing Input Field!';
        
        if (!req.body.username.trim()) throw "Routes/Users.js/put: Username cannot be empty!";
        if (!req.body.firstName.trim()) throw "Routes/Users.js/put: FirstName cannot be empty!";
        if (!req.body.lastName.trim()) throw "Routes/Users.js/put: LastName cannot be empty!";
        if (!req.body.email.trim()) throw "Routes/Users.js/put: Email cannot be empty!";
        if (!req.body.password.trim()) throw "Routes/Users.js/put: Password cannot be empty!";
        if (!req.body.bio.trim()) throw "Routes/Users.js/put: Bio cannot be empty!";

        if (!emailValidator.validate(email)) throw "Routes/Users.js/put: Email must be valid!";

        const hashedPassword = await bcrypt.hash(req.body.password, 16);

        const user = await userData.update(req.params.id, {
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.lastName,
            hashedPassword: hashedPassword,
            bio: req.body.bio
        });

        res.redirect('/private');
    } catch(e) {
        res.status(400).json(e);
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
    } catch(e) {
        res.status(400).json(e);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        if (isNan(parseInt(req.params.id))) throw 'Routes/Users.js/delete: Id must be a number!';

        const user = await userData.delete(req.params.id);

        res.send("<h2>Account has successfully been deleted!</h2>");
    } catch(e) {
        res.status(400).json(e);
    }
});

module.exports = router;