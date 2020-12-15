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
    const user1 = await users.add("Double Chalupa Box", "Scott", "Steiner", "lschaffn@stevens.edu", password1, "A short bio");
    const user2 = await users.add("Cheesy Gordita Crunch Combo", "Rick", "Steiner", "lschaffn@stevens.edu", password2, "A longer bio");

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
            latitude: 50.50,
            longitude: 45.45
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

    //const review1 = await reviews.addReview("Good", restaurant1._id.toString(), user1._id.toString(), 5, "08/09/2020", "good restaurant", ["healthy"]);
    //const review2 = await reviews.addReview("Bad", restaurant2._id.toString(), user2._id.toString(), 1, "08/22/2020", "bad restaurant", []);
    //const comment1 = await comments.addComment(user2._id.toString(), review1._id.toString(), "I agree with this review", "08/09/2020");
    //const comment2 = await comments.addComment(user1._id.toString(), review2._id.toString(), "I don't agree with this review", "08/22/2020");

    await db.serverConfig.close();
}
main();