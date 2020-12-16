const dbConnection = require("./config/mongoConnection");
const data = require("./data");
const users = data.users;
const restaurants = data.restaurants;
const reviews = data.reviews;
const comments = data.comments;
const bcrypt = require("bcrypt");

async function main() {
    const db = await dbConnection();
    await db.dropDatabase();

    const password1 = await bcrypt.hash("abcde", 16);
    const password2 = await bcrypt.hash("12345", 16);
    const password3 = await bcrypt.hash("lmnop", 16);
    const password4 = await bcrypt.hash("password1", 16);
    let user1 = {
        username: "double chalupa box",
        firstName: "Scott",
        lastName: "Steiner",
        email: "lschaffn@stevens.edu",
        hashedPassword: password1,
        bio: "A short bio",
        reviews:[],
        comments: []
    };
    let user2 = {
        username: "cheesy gordita crunch combo",
        firstName: "Rick",
        lastName: "Steiner",
        email: "qschaffn@stevens.edu",
        hashedPassword: password2,
        bio: "A longer bio",
        reviews:[],
        comments: []
    }
    let user3 = {
        username: "dabeast",
        firstName: "Brock",
        lastName: "Lesnar",
        email: "gschaffn@stevens.edu",
        hashedPassword: password3,
        bio: "Another user bio",
        reviews:[],
        comments: []
    }
    let user4 = {
        username: "fiendish triple chalupa experience",
        firstName: "Paul",
        lastName: "Heyman",
        email: "nschaffn@stevens.edu",
        hashedPassword: password4,
        bio: "And this one might be the longest review yet",
        reviews:[],
        comments: []
    }
    user1 = await users.add(user1);
    user2 = await users.add(user2);
    user3 = await users.add(user3);
    user4 = await users.add(user4);

    let restaurant1 = {
        name: "Starbucks",
        owner: "fjafri@stevens.edu",
        categories: ["Fast Food", "Casual Dining"],
        rating: 4,
        reviews: [],
        featuredItems: [{ "Coffee": "$1.99" }, { "Espresso": "$1.99" }, { "Cappuccino": "$2.99" }],
        menu: "http://www.google.com",
        serviceModes: ["Dine-in", "Takeaway"],
        location: {
            address: "1 Castle Point Terrace",
            latitude: 40.7447411,
            longitude: -74.0465031
        },
        hours: { "Sunday": "8:00 AM - 6:00 PM", "Monday": "7:00 AM - 5:00 PM", "Tuesday": "8:00 AM - 9:00 PM", "Wednesday": "8:00 AM - 6:00 PM", "Thursday": "8:00 AM - 6:00 PM", "Friday": "8:00 AM - 6:00 PM", "Saturday": "10:00 AM - 6:00 PM" },
        frequentTags: ['Awaiting more reviews']
    }
    restaurant1 = await restaurants.addRestaurant(restaurant1);

    let restaurant2 = {
        name: "Dunkin Donuts",
        owner: "fjafri@example.com",
        categories: ["Ethnic"],
        rating: 0,
        reviews: [],
        featuredItems: [{ "Coffee": "$1.99" }],
        menu: "http://www.facebook.com",
        serviceModes: ["Delivery"],
        location: {
            address: "1 Castle Point Terrace",
            latitude: 50.50,
            longitude: 45.45
        },
        nearByRestaurants: [restaurant1._id.toString()],
        hours: { "Sunday": "9:00 AM - 9:00 PM", "Monday": "5:00 AM - 9:00 PM", "Tuesday": "8:00 AM - 9:00 PM", "Wednesday": "8:00 AM - 6:00 PM", "Thursday": "9:00 AM - 9:00 PM", "Friday": "8:00 AM - 6:00 PM", "Saturday": "10:00 AM - 6:00 PM" },
        frequentTags: ['healthy']
    }
    restaurant2 = await restaurants.addRestaurant(restaurant2);

    let restaurant3 = {
        name: "McDonald's",
        owner: "ronald@example.com",
        categories: ["Fast Food"],
        rating: 1,
        reviews: [],
        featuredItems: [{ "Cheeseburger": "$0.99" }],
        menu: "http://www.facebook.com",
        serviceModes: ["Takeout"],
        location: {
            address: "2 Castle Point Terrace",
            latitude: 52.1,
            longitude: 45.9
        },
        nearByRestaurants: [restaurant1._id.toString()],
        hours: { "Sunday": "9:00 AM - 9:00 PM", "Monday": "5:00 AM - 9:00 PM", "Tuesday": "8:00 AM - 9:00 PM", "Wednesday": "8:00 AM - 6:00 PM", "Thursday": "9:00 AM - 9:00 PM", "Friday": "8:00 AM - 6:00 PM", "Saturday": "10:00 AM - 6:00 PM" },
        frequentTags: ['Awaiting more reviews']
    }
    restaurant3 = await restaurants.addRestaurant(restaurant3);

    let restaurant4 = {
        name: "Five Star Diner",
        owner: "starman@example.com",
        categories: ["Diner"],
        rating: 4,
        reviews: [],
        featuredItems: [{ "Steak": "$10.99" }, {"Chicken Pot Pie": "$9.99"}],
        menu: "http://www.youtube.com",
        serviceModes: ["Dine-in"],
        location: {
            address: "902 Washington Street",
            latitude: 51.15,
            longitude: 44.95
        },
        nearByRestaurants: [restaurant1._id.toString()],
        hours: { "Sunday": "9:00 AM - 9:00 PM", "Monday": "5:00 AM - 9:00 PM", "Tuesday": "8:00 AM - 9:00 PM", "Wednesday": "8:00 AM - 6:00 PM", "Thursday": "9:00 AM - 9:00 PM", "Friday": "8:00 AM - 6:00 PM", "Saturday": "10:00 AM - 6:00 PM" },
        frequentTags: ['Awaiting more reviews']
    }
    restaurant4 = await restaurants.addRestaurant(restaurant4);

    let restaurant5 = {
        name: "Baba Booey's Big BBQ",
        owner: "booman@example.com",
        categories: ["BBQ"],
        rating: 3,
        reviews: [],
        featuredItems: [{ "Ribs": "$9.99" }],
        menu: "http://www.twitter.com",
        serviceModes: ["Dine-in", "Takeout"],
        location: {
            address: "512 Washington Street",
            latitude: 53.01,
            longitude: 44.39
        },
        nearByRestaurants: [restaurant1._id.toString()],
        hours: { "Sunday": "9:00 AM - 9:00 PM", "Monday": "5:00 AM - 9:00 PM", "Tuesday": "8:00 AM - 9:00 PM", "Wednesday": "8:00 AM - 6:00 PM", "Thursday": "9:00 AM - 9:00 PM", "Friday": "8:00 AM - 6:00 PM", "Saturday": "10:00 AM - 6:00 PM" },
        frequentTags: ['Awaiting more reviews']
    }
    restaurant5 = await restaurants.addRestaurant(restaurant5);

    let restaurant6 = {
        name: "White Castle",
        owner: "castle@example.com",
        categories: ["Fast Food"],
        rating: 1,
        reviews: [],
        featuredItems: [{ "Slider": "$0.99" }, { "Cheese Slider": "$1.99"}],
        menu: "http://www.google.com",
        serviceModes: ["Delivery", "Takeout"],
        location: {
            address: "705 Jefferson Street",
            latitude: 55.35,
            longitude: 44.29
        },
        nearByRestaurants: [restaurant1._id.toString()],
        hours: { "Sunday": "9:00 AM - 9:00 PM", "Monday": "5:00 AM - 9:00 PM", "Tuesday": "8:00 AM - 9:00 PM", "Wednesday": "8:00 AM - 6:00 PM", "Thursday": "9:00 AM - 9:00 PM", "Friday": "8:00 AM - 6:00 PM", "Saturday": "10:00 AM - 6:00 PM" },
        frequentTags: ['Awaiting more reviews']
    }
    restaurant6 = await restaurants.addRestaurant(restaurant6);

    let restaurant7 = {
        name: "McDonald's",
        owner: "ronald@example.com",
        categories: ["Fast Food"],
        rating: 3,
        reviews: [],
        featuredItems: [{ "Burger": "$0.99" }],
        menu: "http://www.twitter.com",
        serviceModes: ["Dine-in", "Takeout"],
        location: {
            address: "402 Newark Street",
            latitude: 56.01,
            longitude: 41.39
        },
        nearByRestaurants: [restaurant1._id.toString()],
        hours: { "Sunday": "9:00 AM - 9:00 PM", "Monday": "5:00 AM - 9:00 PM", "Tuesday": "8:00 AM - 9:00 PM", "Wednesday": "8:00 AM - 6:00 PM", "Thursday": "9:00 AM - 9:00 PM", "Friday": "8:00 AM - 6:00 PM", "Saturday": "10:00 AM - 6:00 PM" },
        frequentTags: ['Awaiting more reviews']
    }
    restaurant7 = await restaurants.addRestaurant(restaurant7);
    
    let restaurant8 = {
        name: "CS 546 The Resturant",
        owner: "hill@example.com",
        categories: ["Cafe"],
        rating: 4,
        reviews: [],
        featuredItems: [{ "Lab 2 Burger": "$8.99" }],
        menu: "http://www.stevens.edu",
        serviceModes: ["Dine-in", "Takeout"],
        location: {
            address: "404 Newark Street",
            latitude: 52.31,
            longitude: 42.08
        },
        nearByRestaurants: [restaurant1._id.toString()],
        hours: { "Sunday": "9:00 AM - 9:00 PM", "Monday": "5:00 AM - 9:00 PM", "Tuesday": "8:00 AM - 9:00 PM", "Wednesday": "8:00 AM - 6:00 PM", "Thursday": "9:00 AM - 9:00 PM", "Friday": "8:00 AM - 6:00 PM", "Saturday": "10:00 AM - 6:00 PM" },
        frequentTags: ['Awaiting more reviews']
    }
    restaurant8 = await restaurants.addRestaurant(restaurant8);  

    const review1 = await reviews.addReview("Good", restaurant1._id.toString(), user1._id.toString(), 5, "08/09/2020", "good restaurant", ["healthy"]);
    const review4 = await reviews.addReview("Good", restaurant1._id.toString(), user2._id.toString(), 4, "08/11/2020", "this was a great place to eat, service was good.", ["delicious"]);
    const review2 = await reviews.addReview("Bad", restaurant2._id.toString(), user2._id.toString(), 1, "08/22/2020", "bad restaurant, never coming back ever again. service was miserable.", []);
    const review5 = await reviews.addReview("Bad", restaurant2._id.toString(), user3._id.toString(), 2, "08/13/2020", "Not that good. Food was overcooked and tasted weird.", []);
    const review3 = await reviews.addReview("Alright", restaurant3._id.toString(), user1._id.toString(), 3, "08/11/2020", "It could've been better!", ["healthy"]);
    const review6 = await reviews.addReview("Great", restaurant3._id.toString(), user4._id.toString(), 5, "08/19/2020", "Best meal of my life, I'm gonna come back.", ["expensive"]);
    const review7 = await reviews.addReview("Bad", restaurant4._id.toString(), user3._id.toString(), 2, "08/14/2020", "Food was cold when I got it, and hard as a rock.", ["healthy"]);
    const review8 = await reviews.addReview("Alright", restaurant4._id.toString(), user2._id.toString(), 3, "08/13/2020", "Very mediocre, more like three star imo", []);
    const review9 = await reviews.addReview("Good", restaurant5._id.toString(), user4._id.toString(), 4, "08/20/2020", "The sauce is the boss here. Great food, friendly service", ["delicious"]);
    const review10 = await reviews.addReview("Great", restaurant5._id.toString(), user2._id.toString(), 5, "08/13/2020", "Baba Booey never steers me wrong. Love this place.", []);
    const review11 = await reviews.addReview("Bad", restaurant6._id.toString(), user2._id.toString(), 1, "08/13/2020", "Complete scams. Not worth the money.", []);
    const review12 = await reviews.addReview("Great", restaurant6._id.toString(), user3._id.toString(), 4, "08/5/2020", "I worship this place. Eat here once a week at least.", ["delicious"]);
    const review13 = await reviews.addReview("Great", restaurant7._id.toString(), user1._id.toString(), 5, "08/13/2020", "Great food, much better than the other one.", ["delicious"]);
    const review14 = await reviews.addReview("Alright", restaurant7._id.toString(), user4._id.toString(), 3, "08/30/2020", "Not bad, burger was good. Think one of the employees growled at me.", []);
    const review15 = await reviews.addReview("Good", restaurant8._id.toString(), user2._id.toString(), 4, "09/30/2020", "Tried to order a coffee and learned MongoDB instead. Nice atmosphere though.", []);



    //const comment1 = await comments.addComment(user2._id.toString(), review1._id.toString(), "I agree with this review", "08/09/2020");
    //const comment2 = await comments.addComment(user1._id.toString(), review2._id.toString(), "I don't agree with this review", "08/22/2020");

    await db.serverConfig.close();
}
main();