const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;
const bcrypt = require('bcrypt');
const emailValidator = require("email-validator");

router.get('/:id', async (req, res) => {
    try {
        if (isNan(parseInt(req.params.id))) throw 'Routes/Users.js/get: Id must be a number!';
        
        const users = await userData.getAll();
        let bool = false;
        for (let i=0; i<users.lenth; i++) {
            if (parseInt(req.params.id) === users[i]._id.toString()) {
                bool = true;
                break;
            }
        }
        if (!bool) throw 'Routes/Users.js/get: Id does not exist!'

        const user = await userData.getById(req.params.id);

        // Send to Page
    } catch(e) {
        res.status(400).json(e);
    }
});

router.post('/', async (req, res) => {
    try {
        if (!req.body) throw 'Routes/Users.js/post: You must provide data to create a user!';
        if (!req.body.username || !req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password || !req.body.bio || !req.body.profilePic) throw 'Routes/Users.js/post: Missing Input Field!';
        
        if (typeof req.body.username !== "string") throw "Routes/Users.js/post: Username must be a string!";
        if (typeof req.body.firstName !== "string") throw "Routes/Users.js/post: FirstName must be a string!";
        if (typeof req.body.lastName !== "string") throw "Routes/Users.js/post: LastName must be a string!";
        if (typeof req.body.email !== "string") throw "Routes/Users.js/post: Email must be a string!";
        if (typeof req.body.password !== "string") throw "Routes/Users.js/post: Password must be a string!";
        if (typeof req.body.bio !== "string") throw "Routes/Users.js/post: Bio must be a string!";
        // Profile Pic

        if (!req.body.username.trim()) throw "Routes/Users.js/post: Username cannot be empty!";
        if (!req.body.firstName.trim()) throw "Routes/Users.js/post: FirstName cannot be empty!";
        if (!req.body.lastName.trim()) throw "Routes/Users.js/post: LastName cannot be empty!";
        if (!req.body.email.trim()) throw "Routes/Users.js/post: Email cannot be empty!";
        if (!req.body.password.trim()) throw "Routes/Users.js/post: Password cannot be empty!";
        if (!req.body.bio.trim()) throw "Routes/Users.js/post: Bio cannot be empty!";
        // Profile Pic

        if (!emailValidator.validate(req.body.email)) throw "Routes/Users.js/post: Email must be valid!"; // Validate Email

        // Hash Password

        const user = await userData.add(req.body);

        // Send to Page
    } catch(e) {
        res.status(400).json(e);
    }
});

router.put('/:id', async (req, res) => {
    try {
        if (isNan(parseInt(req.params.id))) throw 'Routes/Users.js/put: Id must be a number!';
        
        const users = await userData.getAll();
        let bool = false;
        for (let i=0; i<users.lenth; i++) {
            if (parseInt(req.params.id) === users[i]._id.toString()) {
                bool = true;
                break;
            }
        }
        if (!bool) throw 'Routes/Users.js/put: Id does not exist!'
        
        if (!req.body) throw 'Routes/Users.js/put: You must provide data to update a user!';
        if (!req.body.username || !req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password || !req.body.bio || !req.body.profilePic) throw 'Routes/Users.js/put: Missing Input Field!';
        
        if (typeof req.body.username !== "string") throw "Routes/Users.js/put: Username must be a string!";
        if (typeof req.body.firstName !== "string") throw "Routes/Users.js/put: FirstName must be a string!";
        if (typeof req.body.lastName !== "string") throw "Routes/Users.js/put: LastName must be a string!";
        if (typeof req.body.email !== "string") throw "Routes/Users.js/put: Email must be a string!";
        if (typeof req.body.password !== "string") throw "Routes/Users.js/put: password must be a string!";
        if (typeof req.body.bio !== "string") throw "Routes/Users.js/put: Bio must be a string!";
        // Profile Pic

        if (!req.body.username.trim()) throw "Routes/Users.js/put: Username cannot be empty!";
        if (!req.body.firstName.trim()) throw "Routes/Users.js/put: FirstName cannot be empty!";
        if (!req.body.lastName.trim()) throw "Routes/Users.js/put: LastName cannot be empty!";
        if (!req.body.email.trim()) throw "Routes/Users.js/put: Email cannot be empty!";
        if (!req.body.password.trim()) throw "Routes/Users.js/put: Password cannot be empty!";
        if (!req.body.bio.trim()) throw "Routes/Users.js/put: Bio cannot be empty!";
        // Profile Pic

        if (!emailValidator.validate(email)) throw "Routes/Users.js/put: Email must be valid!";

        // Hash Password

        const user = await userData.update(req.params.id, req.body);

        // Send to Page
    } catch(e) {
        res.status(400).json(e);
    }
});

router.patch('/:id', async (req, res) => {
    try {
        if (isNan(parseInt(req.params.id))) throw 'Routes/Users.js/patch: Id must be a number!';
        
        const users = await userData.getAll();
        let bool = false;
        for (let i=0; i<users.lenth; i++) {
            if (parseInt(req.params.id) === users[i]._id.toString()) {
                bool = true;
                break;
            }
        }
        if (!bool) throw 'Routes/Users.js/patch: Id does not exist!'
        
        if (!req.body) throw 'Routes/Users.js/post: You must provide data to create a user!';
        let updatedObject = {};
        const oldUser = await userData.getById(req.params.id);
        
        if (req.body.username && req.body.username !== oldUser.username) {
            if (typeof req.body.username !== 'string') throw 'Routes/Users.js/patch: Username must be a string!';
            if (!req.body.username.trim()) throw 'Routes/Users.js/patch: Username cannot be empty!';
            updatedObject.username = req.body.username;
        }
        if (req.body.firstName && req.body.firstName !== oldUser.firstName) {
            if (typeof req.body.firstName !== 'string') throw 'Routes/Users.js/patch: FirstName must be a string!';
            if (!req.body.firstName.trim()) throw 'Routes/Users.js/patch: FirstName cannot be empty!';
            updatedObject.firstName = req.body.firstName;
        }
        if (req.body.lastName && req.body.lastName !== oldUser.lastName) {
            if (typeof req.body.lastName !== 'string') throw 'Routes/Users.js/patch: LastName must be a string!';
            if (!req.body.lastName.trim()) throw 'Routes/Users.js/patch: LastName cannot be empty!';
            updatedObject.lastName = req.body.lastName;
        }
        if (req.body.email && req.body.email !== oldUser.email) {
            if (typeof req.body.emil !== 'string') throw 'Routes/Users.js/patch: Email must be a string!';
            if (!req.body.email.trim()) throw 'Routes/Users.js/patch: Email cannot be empty!';
            if (!emailValidator.validate(req.body.email)) throw "Routes/Users.js/patch: Email must be valid!";
            updatedObject.email = req.body.email;
        }
        if (req.body.bio && req.body.bio !== oldUser.bio) {
            if (typeof req.body.bio !== 'string') throw 'Routes/Users.js/patch: Bio must be a string!';
            if (!req.body.bio.trim()) throw 'Routes/Users.js/patch: Bio cannot be empty!';
            updatedObject.bio = req.body.bio;
        }
        // Password
        // Profile Pic

        const user = await userData.update(req.params.id, updatedObject);

        // Send to Page
    } catch(e) {
        res.status(400).json(e);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        if (isNan(parseInt(req.params.id))) throw 'Routes/Users.js/delete: Id must be a number!';
        
        const users = await userData.getAll();
        let bool = false;
        for (let i=0; i<users.lenth; i++) {
            if (parseInt(req.params.id) === users[i]._id.toString()) {
                bool = true;
                break;
            }
        }
        if (!bool) throw 'Routes/Users.js/delete: Id does not exist!'

        const user = await userData.delete(req.params.id);

        // Send to Page
    } catch(e) {
        res.status(400).json(e);
    }
});

module.exports = router;