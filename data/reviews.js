const mongoCollections = require("../config/mongoCollections");
const reviews = mongoCollections.reviews;
const users = require("./users");
const restaurants = require("./restaurants");
// const comments = require("./comments");
let { ObjectId } = require("mongodb");


async function getAllReviews() {
    const reviewCollection = await reviews();
    const reviewList = await reviewCollection.find({}).toArray();
    if (!reviewList) throw "No review in system";
    for (let r of reviewList) {
        r._id = r._id.toString();
    }
    return reviewList;
}

async function getReviewById(id) {
    if (!id) throw "Id not exist";
    if (typeof id != "string") throw "Id type invalid";
    let parsedId = ObjectId(id);
    const reviewCollection = await reviews();
    const review = await reviewCollection.findOne({ _id: parsedId });
    if (!review) throw "Review not found";
    review._id = review._id.toString();
    return review;
}

async function addReview(review) {
    this.informationValidation(review);
    const reviewCollection = await reviews();

    const newInsertInfo = await reviewCollection.insertOne(review);
    if (newInsertInfo.insertedCount === 0) throw "Insertion failed";
    console.log(newInsertInfo.insertedId.toString());
    console.log(review.userId);
    await users.addReviewToUser(review.userId, newInsertInfo.insertedId.toString());
    await restaurants.addReviewToRestaurant(review.restaurantId, newInsertInfo.insertedId.toString());
    return await this.getReviewById(newInsertInfo.insertedId.toString());
}

async function removeReview(id) {
    if (!id || typeof id !== "string" || !id.trim()) throw "Invalid id";
    let parsedId = ObjectId(id);
    const reviewCollection = await reviews();
    const deleteInfo = await reviewCollection.removeOne({ _id: parsedId });
    if (deleteInfo.deletedCount === 0) throw "Deletion failed";
}

async function updateReview(id, updatedReview) {
    if (!id || typeof id !== "string" || !id.trim()) throw "Invalid id";
    this.informationValidation(updatedReview);
    /*if (!updatedReview.comments) throw "Comments not exist";
    if (!Array.isArray(updatedReview.comments)) throw "Comments not array";
    if (updatedReview.comments.length !== 0) {
        for (let c of updatedReview.comments) {
            let parsedId = ObjectId(c);
            // object id validation
        }
    }*/
    let parsedId = ObjectId(id);
    const reviewCollection = await reviews();
    await reviewCollection.updateOne({ _id: parsedId }, { $set: updatedReview });
    return await this.getReviewById(id);
}

async function addCommentToReview(reviewId, commentId) {
    if (!reviewId || !commentId) throw "Id not exist";
    if (typeof reviewId != "string" || typeof commentId != "string") {
        throw "Id type invalid";
    }

    let parsedIdR = ObjectId(reviewId);
    const reviewCollection = await reviews();
    const updateInfo = await reviewCollection.updateOne(
        { _id: parsedIdR },
        { $addToSet: { comments: commentId } }
    );

    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) {
        throw "Update failed";
    }
    return await this.getReviewById(reviewId);
}

async function removeCommentFromReview(reviewId, commentId) {
    if (!reviewId || !commentId) throw "Id not exist";
    if (typeof reviewId != "string" || typeof commentId != "string") {
        throw "Id type invalid";
    }

    let parsedIdR = ObjectId(reviewId);
    const reviewCollection = await reviews();
    const updateInfo = await reviewCollection.updateOne(
        { _id: parsedIdR },
        { $pull: { comments: commentId } }
    );

    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) {
        throw "Update failed";
    }
    return await this.getReviewById(reviewId);
}

function informationValidation(review) {
    if (!review.title || typeof review.title != "string" || !review.title.trim()) throw 'Invalid title';
    if (!review.restaurantId || typeof review.restaurantId != "string" || !review.restaurantId.trim()) throw 'Invalid restaurantReviewed';
    if (!review.userId || typeof review.userId != "string" || !review.userId.trim()) throw 'Invalid userId';
    if (!review.rating || typeof review.rating != "number" || review.rating < 1 || review.rating > 5) throw 'Invalid rating';
    if (!review.content || typeof review.content != "string" || !review.content.trim()) throw 'Invalid content';

    ObjectId(review.restaurantId);
    ObjectId(review.userId);
    /*if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateOfReview)) {
        throw "Date published format invalid";
    }
    let dateList = dateOfReview.split("/");
    let month = parseInt(dateList[0]);
    let day = parseInt(dateList[1]);
    let year = parseInt(dateList[2]);
    let d = new Date();
    let dayInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    // lets just ignore 2/29
    if (month < 1 || month > 12) throw "Date reviewed month invalid";
    if (day < 1 || day > dayInMonth[month - 1]) throw "Date reviewed day invalid";
    if (year < 2000 || year > d.getFullYear()) throw "Date reviewed year invalid";*/
}

module.exports = { getAllReviews, getReviewById, addReview, removeReview, updateReview, addCommentToReview, removeCommentFromReview, informationValidation }