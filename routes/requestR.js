const express = require('express');
const router = express.Router();
const data = require('../data');
const requestRestaurants = data.requestRestaurants;

router.post('/', async (req, res) => {    
    const restaurantInfo = req.body;

    if (!restaurantInfo) {
        res.status(400).json({ error: 'data must be provided to create a restaurant' });
        return;
    }
    if (!restaurantInfo.restaurantName || typeof restaurantInfo.restaurantName !== "string" || !restaurantInfo.restaurantName.trim()) {
        res.status(400).json({ error: 'name must be provided to create a restaurant' });
        return;
    }

    let tempCategories = [];
    if (restaurantInfo.fastfood) tempCategories.push(restaurantInfo.fastfood);
    if (restaurantInfo.ethinic) tempCategories.push(restaurantInfo.ethinic);
    if (restaurantInfo.fastcasual) tempCategories.push(restaurantInfo.fastcasual);
    if (restaurantInfo.casualdining) tempCategories.push(restaurantInfo.casualdining);
    if (restaurantInfo.premiumcasual) tempCategories.push(restaurantInfo.premiumcasual);
    if (restaurantInfo.familystyle) tempCategories.push(restaurantInfo.familystyle);
    if (restaurantInfo.finedining) tempCategories.push(restaurantInfo.finedining);
    restaurantInfo.categories = tempCategories;
    
    if (!restaurantInfo.location || typeof restaurantInfo.location !== "string" || !restaurantInfo.location.trim()) {
        res.status(400).json({ error: 'location must be provided to create a restaurant' });
        return;
    }
    if (!restaurantInfo.contact || typeof restaurantInfo.contact !== "string" || !restaurantInfo.contact.trim()) {
        res.status(400).json({ error: 'location.address must be provided to create a restaurant' });
        return;
    }
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
        res.render('requestFinish', {
            authenticated: req.session.user ? true : false
          });
    } catch (e) {
        res.sendStatus(500).json({ error: 'Insertion failed!' });
    }
});


module.exports = router;