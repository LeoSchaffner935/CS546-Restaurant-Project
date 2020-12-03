const mongoCollections = require('../config/mongoCollections');
const comments = mongoCollections.comments;
const reviews = require('./reviews');
let { ObjectId } = require('mongodb');


const exportedMethods = {
    //Finds all comments made by a specific user
    async getAllComments(id) {
        if (!id) {
            throw 'No id provided';
        }
        if (typeof(id) != "string") {
            throw 'Invalid id provided';
        }
        const commentCollection = await comments();
        const allComments = await commentCollection.find({ commenter: {$eq: id}}).toArray();
        if (!allComments) {
            throw "No comments in system";
        }
        return allComments;
      },
    //Find a specific comment by its id
    async getReviewById(id) {
        if (!id) {
            throw 'No id provided';
        }
        if (typeof(id) != "string") {
            throw 'Invalid id provided';
        }
        let parsedId = ObjectId(id);
        const commentCollection = await comments();
        const comment = await commentCollection.findOne({_id: parsedId });
        if (!comment) {
            throw "No comment found for given id";
        }
        comment._id = id;
        return comment;
      },
      //Add a comment
      async addComment(commenter, reviewId, comment, date) {
        if (typeof commenter !== "string" || !commenter || commenter === "") {
            throw 'Commenter must be a non-empty string';
        }
        if (typeof reviewId !== "string" || !reviewId || reviewId === "") {
            throw 'Valid Review Id not supplied';
        }
        if (typeof comment !== "string" || !comment || comment === "") {
            throw 'Valid Comment not entered';
        }
        if (typeof date !== "string" || !date || date === "") {
            throw 'Valid date was not supplied';
        }
        const commentCollection = await comments();
    
        const currReview = await reviews.getReviewById(reviewId);
        if (!currReview) {
            throw "No such review exists";
        }
        let newComment = {
          commenter: commenter,
          reviewId: reviewId,
          comment: comment,
          date: date,
        };
        const newInsertInformation = await commentCollection.insertOne(newComment);
        const newId = (newInsertInformation.insertedId).toString();
        
        await reviews.addCommentToReview(reviewId, newId);
    
        return await this.getCommentById(newId);
      },
      //Remove a comment
      async removeComment(id) {
        if (!id){
            throw "No id was input";
        }
        if (typeof(id) != "string" || id === ""){
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

        await books.removeCommentFromReview(removeIt.reviewId, id);

        const commentInfo = await allComments.removeOne({ _id: parsedId});
        if (commentInfo.deletedCount == 0)
            throw 'Comment could not be deleted';
        return commentInfo;
      }
}
module.exports = exportedMethods;