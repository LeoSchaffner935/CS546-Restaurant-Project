const mongoCollections = require('../config/mongoCollections');
const comments = mongoCollections.comments;
const reviews = require('./reviews');
const users = require('./users');
let { ObjectId } = require('mongodb');


const exportedMethods = {
    //Finds all comments made by a specific user
    async getAllComments(id) {
        if (!id) {
            throw 'No id provided';
        }
        if (typeof (id) != "string") {
            throw 'Invalid id provided';
        }
        const commentCollection = await comments();
        const allComments = await commentCollection.find({ userId: { $eq: id } }).toArray();
        if (!allComments) {
            throw "No comments in system";
        }
        return allComments;
    },
    //Find a specific comment by its id
    async getCommentById(id) {
        if (!id) {
            throw 'No id provided';
        }
        if (typeof (id) != "string") {
            throw 'Invalid id provided';
        }
        let parsedId = ObjectId(id);
        const commentCollection = await comments();
        const comment = await commentCollection.findOne({ _id: parsedId });
        if (!comment) {
            throw "No comment found for given id";
        }
        comment._id = id;
        return comment;
    },
    //Add a comment
    async addComment(comment) {
        if (!comment.userId || typeof comment.userId !== "string" || !comment.userId.trim()) {
            throw 'userId must be a non-empty string';
        }
        if (!comment.reviewId || typeof comment.reviewId !== "string" || !comment.reviewId.trim()) {
            throw 'Valid Review Id not supplied';
        }
        if (!comment.comment || typeof comment.comment !== "string" || !comment.comment.trim()) {
            throw 'Valid Comment not entered';
        }
        const commentCollection = await comments();
        const insertInfo = await commentCollection.insertOne(comment);
        if (insertInfo.insertedCount === 0) throw 'Insertion failed!';
        const newId = insertInfo.insertedId.toString();

        await reviews.addCommentToReview(comment.reviewId, newId);
        await users.addCommentToUser(comment.userId, newId);
        
        return this.getCommentById(newId);
    },
    async updateComment(id, comment) {
        if (!id || typeof id !== "string" || !id.trim()) {
            throw 'id must be a non-empty string';
        }
        if (!comment.userId || typeof comment.userId !== "string" || !comment.userId.trim()) {
            throw 'userId must be a non-empty string';
        }
        if (!comment.reviewId || typeof comment.reviewId !== "string" || !comment.reviewId.trim()) {
            throw 'Valid Review Id not supplied';
        }
        if (!comment.comment || typeof comment.comment !== "string" || !comment.comment.trim()) {
            throw 'Valid Comment not entered';
        }
        let parsedId = ObjectId(id);
        const commentCollection = await comments();
        await commentCollection.updateOne({ _id: parsedId }, { $set: comment });
        return this.getCommentById(id);
    },
    //Remove a comment
    async removeComment(id) {
        if (!id || typeof id !== "string" || !id.trim()) throw "Invalid id";
        let parsedId = ObjectId(id);
        const commentCollection = await comments();
        const commentInfo = await commentCollection.removeOne({ _id: parsedId });
        if (commentInfo.deletedCount == 0) throw 'Comment could not be deleted';
        return this.getCommentById(id);
    }
}
module.exports = exportedMethods;