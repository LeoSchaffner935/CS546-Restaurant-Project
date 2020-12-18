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
        serviceModes: ["Takeaway"],
        location: {
            address: "2 Castle Point Terrace",
            latitude: 50.45,
            longitude: 45.50
        },
        nearByRestaurants: [restaurant1._id.toString()],
        hours: { "Sunday": "9:00 AM - 9:00 PM", "Monday": "5:00 AM - 9:00 PM", "Tuesday": "8:00 AM - 9:00 PM", "Wednesday": "8:00 AM - 6:00 PM", "Thursday": "9:00 AM - 9:00 PM", "Friday": "8:00 AM - 6:00 PM", "Saturday": "10:00 AM - 6:00 PM" },
        frequentTags: ['Awaiting more reviews']
    }
    restaurant3 = await restaurants.addRestaurant(restaurant3);

    let restaurant4 = {
        name: "Five Star Diner",
        owner: "starman@example.com",
        categories: ["Family Style", "Premium Casual"],
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
        categories: ["Family Style", "Premium Casual"],
        rating: 3,
        reviews: [],
        featuredItems: [{ "Ribs": "$9.99" }],
        menu: "http://www.twitter.com",
        serviceModes: ["Dine-in", "Takeaway"],
        location: {
            address: "512 Washington Street",
            latitude: 50.40,
            longitude: 45.39
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
        serviceModes: ["Delivery", "Takeaway"],
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
        serviceModes: ["Takeaway"],
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
        categories: ["Fine Dining"],
        rating: 4,
        reviews: [],
        featuredItems: [{ "Lab 2 Burger": "$8.99" }],
        menu: "http://www.stevens.edu",
        serviceModes: ["Dine-in", "Takeaway"],
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

    let review1 = {title:"Good", restaurantId:restaurant1._id.toString(), userId:user1._id.toString(), rating:5, content:"good restaurant", tags:["delicious"]};
    review1 = await reviews.addReview(review1);
    let review4 = {title:"Good", restaurantId: restaurant1._id.toString(), userId:user2._id.toString(), rating:4, content:"this was a great place to eat, service was good.", tags:["delicious"]}
    review4 = await reviews.addReview(review4);
    let review2 = {title:"Bad", restaurantId: restaurant2._id.toString(), userId: user2._id.toString(), rating: 1, content:"bad restaurant, never coming back ever again. service was miserable.", tags:[]};
    review2 = await reviews.addReview(review2);
    let review5 = {title:"Bad", restaurantId:restaurant2._id.toString(), userId:user3._id.toString(), rating:2, content:"Not that good. Food was overcooked and tasted weird.", tags:[]};
    review5 = await reviews.addReview(review5);
    let review3 = {title:"Alright", restaurantId:restaurant3._id.toString(), userId:user1._id.toString(), rating:3, content:"It could've been better!", tags:["healthy"]};
    review3 = await reviews.addReview(review3);
    let review6 = {title:"Great", restaurantId:restaurant3._id.toString(), userId:user4._id.toString(), rating:5, content:"Best meal of my life, I'm gonna come back.", tags:["expensive"]};
    review6 = await reviews.addReview(review6);
    let review7 = {title:"Bad", restaurantId:restaurant4._id.toString(), userId:user3._id.toString(), rating:2, content: "Food was cold when I got it, and hard as a rock.", tags:["healthy"]};
    review7 = await reviews.addReview(review7);
    let review8 = {title:"Alright", restaurantId:restaurant4._id.toString(), userId:user2._id.toString(), rating:3, content:"Very mediocre, more like three star imo", tags:[]};
    review8 = await reviews.addReview(review8);
    let review9 = {title:"Good", restaurantId:restaurant5._id.toString(), userId:user4._id.toString(), rating:4, content:"The sauce is the boss here. Great food, friendly service", tags:["delicious"]};
    review9 = await reviews.addReview(review9);
    let review10 = {title:"Great", restaurantId:restaurant5._id.toString(), userId:user2._id.toString(), rating:5, content:"Baba Booey never steers me wrong. Love this place.", tags:[]};
    review10 = await reviews.addReview(review10);
    let review11 = {title:"Bad", restaurantId:restaurant6._id.toString(), userId:user2._id.toString(), rating:1, content:"Complete scams. Not worth the money.", tags:[]};
    review11 = await reviews.addReview(review11);
    let review12 = {title:"Great", restaurantId:restaurant6._id.toString(), userId:user3._id.toString(), rating:4, content:"I worship this place. Eat here once a week at least.", tags:["delicious"]};
    review12 = await reviews.addReview(review12);
    let review13 = {title:"Great", restaurantId:restaurant7._id.toString(), userId:user1._id.toString(), rating:5, content:"Great food, much better than the other one.", tags:["delicious"]};
    review13 = await reviews.addReview(review13);
    let review14 = {title:"Alright", restaurantId:restaurant7._id.toString(), userId:user4._id.toString(), rating:3, content:"Not bad, burger was good. Think one of the employees growled at me.", tags:[]};
    review14 = await reviews.addReview(review14);
    let review15 = {title:"Good", restaurantId:restaurant8._id.toString(), userId:user2._id.toString(), rating:4, content:"Tried to order a coffee and learned MongoDB instead. Nice atmosphere though.", tags:[]};
    review15 = await reviews.addReview(review15);


    //const comment1 = await comments.addComment(user2._id.toString(), review1._id.toString(), "I agree with this review", "08/09/2020");
    //const comment2 = await comments.addComment(user1._id.toString(), review2._id.toString(), "I don't agree with this review", "08/22/2020");

    await db.serverConfig.close();
}
main();
