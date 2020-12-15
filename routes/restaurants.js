const express = require('express');
const router = express.Router();
const data = require('../data');
const restaurantData = data.restaurants;
const reviewData = data.reviews;
const userData = data.users;

router.get('/', async (req, res) => {
    try {
        const allRestaurants = await restaurantData.getAllRestaurants();
        res.render('restaurants', {
            restaurants: allRestaurants
        });
    } catch (e) {
        res.status(500).json({ error: 'Error occured while fetching restaurant!' });
    }
});

router.get('/:id', async (req, res) => {
    if (!req.params.id) {
        res.status(400).json({ error: 'You must Supply an ID to get' });
        return;
    }
    let id = req.params.id;
    let restaurant;
    try {
        restaurant = await restaurantData.getRestaurantById(id);
        const allReviews = await reviewData.getAllReviews();
        restaurant.reviews = allReviews.filter(review => review.restaurantReviewed === restaurant._id);
        for (review of restaurant.reviews) {
            review.user = await userData.getById(review.userId);
        }
    } catch (e) {
        res.status(404).json({ error: 'restaurant not found!' });
    }

    let authenticated = req.session.user ? true : false;
    res.render('restaurant', {
        restaurant: restaurant,
        authenticated: authenticated
    });
});

router.post('/', async (req, res) => {
    const allowedCategories = ['Fast Food', 'Ethnic', 'Fast Casual', 'Casual Dining', 'Premium Casual', 'Family Style', 'Fine Dining'];
    const allowedServiceModes = ['Dine-in', 'Takeaway', 'Delivery'];
    const allowedDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const restaurantInfo = req.body;
    if (!restaurantInfo) {
        res.status(400).json({ error: 'data must be provided to create a restaurant' });
        return;
    }
    if (!restaurant.name || typeof restaurant.name !== "string" || !restaurant.name.trim()) {
        res.status(400).json({ error: 'name must be provided to create a restaurant' });
        return;
    }
    if (!restaurant.menu || typeof restaurant.menu !== "string" || !restaurant.menu.trim()) {
        res.status(400).json({ error: 'menu must be provided to create a restaurant' });
        return;
    }
    if (!restaurant.owner || typeof restaurant.owner !== "string" || !restaurant.owner.trim()) {
        res.status(400).json({ error: 'owner must be provided to create a restaurant' });
        return;
    }
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(String(restaurant.owner).toLowerCase())) {
        res.status(400).json({ error: "owner's email address is incorrectly formatted" });
        return;
    }
    let user;
    try {
        user = userData.getByEmail(restaurant.owner.toLowerCase());
    } catch (e) {
        res.status(404).json({ error: 'User with given email does not exist' });
        return;
    }
    if (!restaurant.categories || !Array.isArray(restaurant.categories)) {
        res.status(400).json({ error: 'categories must be properly defined' });
        return;
    }
    let tempCategories = [];
    for (const category of restaurant.categories) {
        if (!allowedCategories.includes(category)) {
            res.status(400).json({ error: 'unknown category passed in input' });
            return;
        }
        if (!tempCategories.includes(category)) tempCategories.push(category);
    }
    restaurant.categories = tempCategories;
    if (restaurant.featuredItems) {
        if (!Array.isArray(restaurant.featuredItems)) {
            res.status(400).json({ error: 'featuredItems must be an array' });
            return;
        }
        for (const item of restaurant.featuredItems) {
            if (typeof item !== "object" || Array.isArray(item)) {
                res.status(400).json({ error: 'items inside featuredItems must be objects' });
                return;
            }
            if (Object.keys(item).length != 1) {
                res.status(400).json({ error: 'items inside featuredItems can only have one key-value pair' });
                return;
            }
            for (const key of Object.keys(item)) {
                if (typeof key !== "string" || !key.trim()) {
                    res.status(400).json({ error: "invalid key provided inside featuredItems' object" });
                    return;
                }
                if (typeof item[key] !== "string" || !item[key].trim() || item[key].charAt(0) !== '$' || Number.isNaN(item[key].substring(1))) {
                    res.status(400).json({ error: "invalid value provided inside featuredItems' object" });
                    return;
                }
            }
        }
    }
    if (!restaurant.location || typeof restaurant.location !== "object" || Array.isArray(restaurant.location)) {
        res.status(400).json({ error: 'location must be provided to create a restaurant' });
        return;
    }
    if (!restaurant.location.address || typeof restaurant.location.address !== "string" || !restaurant.location.address.trim()) {
        res.status(400).json({ error: 'location.address must be provided to create a restaurant' });
        return;
    }
    if (restaurant.location.latitude == undefined || typeof restaurant.location.latitude !== "number") {
        res.status(400).json({ error: 'location.latitude must be provided to create a restaurant' });
        return;
    }
    if (restaurant.location.longitude == undefined || typeof restaurant.location.longitude !== "number") {
        res.status(400).json({ error: 'location.longitude must be provided to create a restaurant' });
        return;
    }
    if (!restaurant.serviceModes || !Array.isArray(restaurant.serviceModes)) {
        res.status(400).json({ error: 'serviceModes must be provided to create a restaurant' });
        return;
    }
    let tempServiceModes = [];
    for (const serviceMode of restaurant.serviceModes) {
        if (!allowedServiceModes.includes(serviceMode)) {
            res.status(400).json({ error: 'unknown serviceMode passed in input' });
            return;
        }
        if (!tempServiceModes.includes(serviceMode)) tempServiceModes.push(serviceMode);
    }
    if (!restaurant.hours || typeof restaurant.hours !== "object" || Object.keys(restaurant.hours).length !== 7) {
        res.status(400).json({ error: 'hours is not properly sent in input' });
        return;
    }
    for (const key of Object.keys(restaurant.hours)) {
        if (!allowedDays.includes(key)) {
            res.status(400).json({ error: 'unknown day passed in hours' });
            return;
        }
        // specify formatting for hours from UI
    }
    let newRestaurant = {
        name: restaurant.name,
        owner: restaurant.owner,
        categories: restaurant.categories,
        rating: 0,
        reviews: [],
        featuredItems: restaurant.featuredItems,
        menu: restaurant.menu,
        serviceModes: restaurant.serviceModes,
        location: restaurant.location,
        nearByRestaurants: [],
        hours: {},
        frequentTags: []
    };
    try {
        newRestaurant = await restaurantData.addRestaurant(newRestaurant);
        res.render('restaurant', {
            restaurant: newRestaurant
        });
    } catch (e) {
        res.sendStatus(500).json({ error: 'Insertion failed!' });
    }
});

router.post('/:id/reviews', async (req, res) => {
    if (!req.params.id) {
        res.status(400).json({ error: 'You must Supply an ID to get' });
        return;
    }
    const restaurantId = req.params.id;
    const review = req.body;
    if (!review) {
        res.status(400).json({ error: 'Data must be passed to add a review' });
        return;
    }
    try {
        let restaurant = await restaurantData.getRestaurantById(restaurantId);
    } catch (e) {
        res.status(404).json({ error: 'Restaurant not found with given id!' });
        return;
    }
    review.userId = req.session.user._id;
    if (!review.rating || Number.isNaN(review.rating)) {
        res.status(400).json({ error: 'Rating is not a number' });
        return;
    }
    review.rating = parseInt(review.rating);
    if (review.rating < 1 || review.rating > 5) {
        res.status(400).json({ error: 'Rating must be from 1-5' });
        return;
    }
    const dateOfReview = new Date();
    if (!review.title || typeof review.title !== "string" || !review.title.trim()) {
        res.status(400).json({ error: 'Title is empty' });
        return;
    }
    if (!review.content || typeof review.content !== "string" || !review.content.trim()) {
        res.status(400).json({ error: 'Content is empty' });
        return;
    }
    let newTags = [];
    if (review.tags) {
        if (typeof review.tags !== "string" || !review.tags.trim()) {
            res.status(400).json({ error: 'Invalid tags' });
            return;
        }
        for (tag of review.tags.split(",")) {
            if (!newTags.includes(tag.trim())) newTags.push(tag.trim());
        }
    }
    review.tags = newTags;
    let newReview = await reviewData.addReview(review.title, restaurantId, review.userId, review.rating, dateOfReview, review.content, review.tags);
    newReview.username = req.session.user.username;
    res.json(newReview);
});

router.put('/', async (req, res) => {
    res.json("To be implemented");
});

router.patch('/', async (req, res) => {
    res.json("To be implemented");
});

router.delete('/', async (req, res) => {
    res.json("To be implemented");
});

module.exports = router;