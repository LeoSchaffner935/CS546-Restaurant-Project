const mongoCollections = require("../config/mongoCollections");
const reviews = mongoCollections.reviews;
const restaurants = require("./restaurants");
const users = require('./users');
const comments = require('./comments');
let { ObjectId } = require("mongodb");

module.exports = {
    async getAllReviews() {
        const reviewCollection = await reviews();
        const reviewList = await reviewCollection.find({}).toArray();
        if (!reviewList) throw "No review in system";
        for (let r of reviewList) {
            r._id = r._id.toString();
        }
        return reviewList;
    },

    async getReviewById(id) {
        if (!id) throw "Id not exist";
        if (typeof id != "string") throw "Id type invalid";
        let parsedId = ObjectId(id);
        const reviewCollection = await reviews();
        const review = await reviewCollection.findOne({_id: parsedId});
        if (!review) throw "Review not found";
        review._id = review._id.toString();
        return review;
    },

    async addReview(title, restaurantReviewed, user, rating, dateOfReview, content, tags) {
        this.informationValidation(title, restaurantReviewed, user, rating, dateOfReview, content, tags);
        const reviewCollection = await reviews();
        let newReview = {
            title: title,
            restaurantReviewed: restaurantReviewed,
            user: user,
            rating: rating,
            dateOfReview: dateOfReview,
            content: content,
            sReview: 0,
            comments: [],
            tags: tags
        };

        const newInsertInfo = await reviewCollection.insertOne(newReview);
        if (newInsertInfo.insertedCount === 0) throw "Insertion failed";
        const newId = newInsertInfo.insertedId;

        try {
            await restaurants.addReviewToRestaurant(restaurantReviewed, newId.toString());
            await users.addReviewToUser(user, newId.toString());
        } catch(e) {
            console.log(e);
            return;
        }

        return await this.getReviewById(newId.toString());
    },

    async removeReview(id) {
        if (!id) throw "Id does not exist";
        if (typeof id != "string") throw "Id type invalid";

        let parsedId = ObjectId(id);
        const reviewCollection = await reviews();
        const review = await this.getReviewById(id);

        try {
            review.comments.forEach(c => {
                await comments.removeComment(c);
            });
            await restaurants.removeReviewFromRestaurant(review.restaurantReviewed, id);
            await users.removeReviewFromUser(review.user, id);
        } catch(e) {
            console.log(e);
        }

        const title = review.title;
        const deleteInfo = await reviewCollection.removeOne({_id: parsedId});
        if (deleteInfo.deletedCount === 0) throw "Deletion failed";
        console.log(`Review ${title} has been successfully deleted`);
        return true;
    },

    async updateReview(id, updatedReview) {
        if (!id) throw "Id not exist";
        if (typeof id != "string") throw "Id type invalid";
        this.informationValidation(updatedReview.title, updatedReview.restaurantReviewed,
            updatedReview.user, updatedReview.rating, updatedReview.dateOfReview, updatedReview.content,
            updatedReview.tags);
        /*if (!updatedReview.comments) throw "Comments not exist";
        if (!Array.isArray(updatedReview.comments)) throw "Comments not array";
        if (updatedReview.comments.length !== 0) {
            for (let c of updatedReview.comments) {
                let parsedId = ObjectId(c);
                // object id validation
            }
        }*/

        const review = await this.getReviewById(id);
        let parsedId = ObjectId(id);
        let reviewUpdatedInfo = {
            title: updatedReview.title,
            restaurantReviewed: updatedReview.restaurantReviewed,
            user: updatedReview.user,
            rating: updatedReview.rating,
            dateOfReview: updatedReview.dateOfReview,
            content: updatedReview.content,
            sReview: updatedReview.sReview,
            comments: review.comments,
            tags: updatedReview.tags
        }
        const reviewCollection = await reviews();
        const updateInfo = await reviewCollection.updateOne(
            { _id: parsedId },
            { $set: reviewUpdatedInfo }
        );
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) {
            throw "Update failed";
        }
        return await this.getReviewById(id);
    },

    async addCommentToReview(reviewId, commentId) {
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
    },

    async removeCommentFromReview(reviewId, commentId) {
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
    },

    informationValidation(title, restaurantReviewed, user, rating, dateOfReview, content, tags) {
        if (!title || !restaurantReviewed || !user || !rating || !dateOfReview || !content || !tags) {
            throw "Information of review is not complete";
        }
        if (typeof title != "string" ||
        typeof restaurantReviewed != "string" ||
        typeof user != "string" ||
        typeof rating != "number" ||
        typeof dateOfReview != "string" ||
        typeof content != "string" ||
        !Array.isArray(tags)) {
            throw "Information of review type invalid";
        }
        if (title.trim().length === 0 ||
        restaurantReviewed.trim().length === 0 ||
        user.trim().length === 0 ||
        dateOfReview.trim().length === 0 ||
        content.trim().length === 0) {
            throw "Information of review is empty or whitespaces only";
        }
        ObjectId(restaurantReviewed);
        ObjectId(user);
        if (rating < 1 || rating > 5) throw "Rating is out of range";
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
}