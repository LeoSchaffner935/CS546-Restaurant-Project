const express = require('express');
const router = express.Router();
const data = require('../data');
const restaurantData = data.restaurants;
const userData = data.users;

router.post('/', async (req, res) => {
    const searchTerm = req.body.searchTerm;
    let allRestaurants = await restaurantData.getAllRestaurants();
    let filteredRestaurants = allRestaurants.filter(restaurant => {
        if (restaurant.name.match(new RegExp(searchTerm, "g"))) {
            return true;
        }
        return false;
    });
    let allUsers = await userData.getAll();
    let filteredUsers = allUsers.filter(user => {
        if (user.username.match(new RegExp(searchTerm, "g"))) {
            return true;
        }
        return false;
    });
    res.render('search', {
        users: filteredUsers,
        restaurants: filteredRestaurants
    });

});

module.exports = router;