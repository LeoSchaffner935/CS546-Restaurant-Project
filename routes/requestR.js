const express = require('express');
const router = express.Router();
const data = require('../data');
const requestRestaurants = data.requestRestaurants;

router.post('/', async (req, res) => {
    const allowedCategories = ['Fast Food', 'Ethnic', 'Fast Casual', 'Casual Dining', 'Premium Casual', 'Family Style', 'Fine Dining'];
    
    const restaurantInfo = req.body;

    if (!restaurantInfo) {
        res.status(400).json({ error: 'data must be provided to create a restaurant' });
        return;
    }
    if (!restaurantInfo.restaurantName || typeof restaurantInfo.restaurantName !== "string" || !restaurantInfo.restaurantName.trim()) {
        res.status(400).json({ error: 'name must be provided to create a restaurant' });
        return;
    }

    // if (!restaurantInfo.categories || !Array.isArray(restaurantInfo.categories)) {
    //     res.status(400).json({ error: 'categories must be properly defined' });
    //     return;
    // }
    // let tempCategories = [];
    // for (const category of restaurantInfo.categories) {
    //     if (!allowedCategories.includes(category)) {
    //         res.status(400).json({ error: 'unknown category passed in input' });
    //         return;
    //     }
    //     if (!tempCategories.includes(category)) tempCategories.push(category);
    // }
    // restaurantInfo.categories = tempCategories;
    
    if (!restaurantInfo.location || typeof restaurantInfo.location !== "string" || !restaurantInfo.location.trim()) {
        res.status(400).json({ error: 'location must be provided to create a restaurant' });
        return;
    }
    if (!restaurantInfo.contact || typeof restaurantInfo.contact !== "string" || !restaurantInfo.contact.trim()) {
        res.status(400).json({ error: 'location.address must be provided to create a restaurant' });
        return;
    }
    console.log(restaurantInfo);
    let newRestaurant = {
        name: restaurantInfo.restaurantName,
        owner: restaurantInfo.owner,
        categories: restaurantInfo.categories,
        location: restaurantInfo.location,
        contact: restaurantInfo.contact,
        reason: restaurantInfo.reason
    };
    try {
        await requestRestaurants.addRestaurant(newRestaurant);
        res.render('requestFinish');
    } catch (e) {
        res.sendStatus(500).json({ error: 'Insertion failed!' });
    }
});


module.exports = router;