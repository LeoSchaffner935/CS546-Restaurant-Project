const express = require('express');
const router = express.Router();
const data = require('../data');
const restaurantData = data.restaurants;
const userData = data.users;

router.post('/', async (req, res) => {
    const searchTerm = req.body.searchTerm.trim().toLowerCase();
    let allRestaurants = await restaurantData.getAllRestaurants();
    let filteredRestaurants = allRestaurants.filter(restaurant => {
        if (restaurant.name.toLowerCase().match(new RegExp(searchTerm, "g"))) {
            return true;
        }
        return false;
    });
    let allUsers = await userData.getAll();
    let filteredUsers = allUsers.filter(user => {
        if (user.username.toLowerCase().match(new RegExp(searchTerm, "g"))) {
            return true;
        }
        return false;
    });
    res.render('search', {
        users: filteredUsers,
        restaurants: filteredRestaurants,
        authenticated: req.session.user ? true : false
    });

});

module.exports = router;