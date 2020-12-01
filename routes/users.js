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
        if (!req.body.username || !req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password || !req.body.bio || !req.body.profilePic) throw 'Routes/Users.js/get: Missing Input Field!';
        
        if (typeof req.body.username !== "string") throw "Routes/Users.js/post: Username must be a string!";
        if (typeof req.body.firstName !== "string") throw "Routes/Users.js/post: FirstName must be a string!";
        if (typeof req.body.lastName !== "string") throw "Routes/Users.js/post: LastName must be a string!";
        if (typeof req.body.email !== "string") throw "Routes/Users.js/post: Email must be a string!";
        if (typeof req.body.hashedPassword !== "string") throw "Routes/Users.js/post: HashedPassword must be a string!";
        if (typeof req.body.bio !== "string") throw "Routes/Users.js/post: Bio must be a string!";
        // Profile Pic

        if (!req.body.username.trim()) throw "Routes/Users.js/post: Username cannot be empty!";
        if (!req.body.firstName.trim()) throw "Routes/Users.js/post: FirstName cannot be empty!";
        if (!req.body.lastName.trim()) throw "Routes/Users.js/post: LastName cannot be empty!";
        if (!req.body.email.trim()) throw "Routes/Users.js/post: Email cannot be empty!";
        if (!req.body.hashedPassword.trim()) throw "Routes/Users.js/post: HashedPassword cannot be empty!";
        if (!req.body.bio.trim()) throw "Routes/Users.js/post: Bio cannot be empty!";
        // Profile Pic

        if (!emailValidator.validate(email)) throw "Routes/Users.js/post: Email must be valid!"; // Validate Email

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
        
        // req.body Error Checking

        const user = await userData.update(req.params.id);

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
        
        // req.body Error Checking

        const user = await userData.update(req.params.id);

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