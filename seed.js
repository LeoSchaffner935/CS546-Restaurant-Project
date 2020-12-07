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
    const user1 = await users.add("Double Chalupa Box", "Scott", "Steiner", "lschaffn@stevens.edu", password1, "A short bio", 1);
    const user2 = await users.add("Cheesy Gordita Crunch Combo", "Rick", "Steiner", "lschaffn@stevens.edu", password2, "A longer bio", 1);
    
    const review1 = await reviews.addReview("Good", "5fbe14351bdee16cdb89296f", "5fbe145bcbedc290547b8d45", 5, "08/09/2020", "good restaurant", ["healthy"]);
    const review2 = await reviews.addReview("Bad", "5fbe14bc684c39c3e29cf169", "5fbe14c49e5a4da6f901117c", 1, "08/22/2020", "bad restaurant", []);
    const review3 = {
        title: "soso",
        restaurantReviewed: "5fbe14351bdee16cdb89296f",
        user: "5fbe18f54854654026f55a5d",
        rating: 4,
        dateOfReview: "07/29/2020",
        content: "nothing special",
        sReview: 1,
        comments: ["5fbe19b760cb30a3c1e3b605", "5fbe19be336cf2b3ec765b69"],
        tags: ["healthy", "cheap"]
    }
    await reviews.updateReview(review1._id.toString(), review3);
    //await reviews.removeReview(review1._id.toString());
    await reviews.addCommentToReview(review1._id.toString(), "5fbe1a3f71eceee5127ab577");
    await reviews.removeCommentFromReview(review1._id.toString(), "5fbe19be336cf2b3ec765b69");

    await db.serverConfig.close();
}

main();
