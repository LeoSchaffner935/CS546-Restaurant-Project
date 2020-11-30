const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;

router.get('/:id', async (req, res) => {
    // Error Checking

    const user = await userData.getById(req.params.id);

    // Send to Page
});

router.post('/', async (req, res) => {
    // Error Checking

    const user = await userData.add(req.body);

    // Send to Page
});

router.put('/:id', async (req, res) => {
    // Error Checking

    const user = await userData.update(req.params.id);

    // Send to Page
});

router.patch('/:id', async (req, res) => {
    // Error Checking

    const user = await userData.update(req.params.id);

    // Send to Page
});

router.delete('/:id', async (req, res) => {
    // Error Checking

    const user = await userData.delete(req.params.id);

    // Send to Page
});

module.exports = router;