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
        const allComments = await commentCollection.find({ commenter: { $eq: id } }).toArray();
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
            throw 'Commenter must be a non-empty string';
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

        await reviews.addCommentToReview(reviewId, newId);
        await users.addCommentToUser(commenter, newId);
        comment._id = newId;
        return comment;
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
        if (!id) {
            throw "No id was input";
        }
        if (typeof (id) != "string" || id === "") {
            throw "Comment id must be a non-empty string";
        }
        const commentCollection = await comments();
        let comment = null;
        try {
            comment = await this.getCommentById(id);
        } catch (e) {
            throw "No comment with that id exists";
        }
        let parsedId = ObjectId(id);
        const allComments = await comments();
        const removeIt = await this.getCommentsById(id);

        await reviews.removeCommentFromReview(removeIt.reviewId, id);
        await users.removeCommentFromUser(removeIt.commenter, id);


        const commentInfo = await allComments.removeOne({ _id: parsedId });
        if (commentInfo.deletedCount == 0)
            throw 'Comment could not be deleted';
        return commentInfo;
    }
}
module.exports = exportedMethods;