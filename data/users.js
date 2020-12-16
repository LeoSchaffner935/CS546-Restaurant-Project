const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const reviews = require('./reviews');
const comments = require('./comments');
const { ObjectId } = require("mongodb");

const exportedMethods = {
  async getById(id) {
    if (!id || typeof id !== "string" || !id.trim()) throw 'Data/Users.js/getById: Invalid id!';
    const parsedId = ObjectId(id);
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: parsedId });
    if (!user) throw 'Data/Users.js/getById: User not found!';
    user._id = user._id.toString();
    return user;
  },

  async getAll() {
    const userCollection = await users();
    let users = await userCollection.find({}).toArray();
    for (user of users) {
      user._id = user._id.toString();
    }
    return users;
  },

  async getByUsername(username) {
    if (!username || typeof username !== "string" || !username.trim()) throw 'Data/Users.js/getByUsername: Invalid username';
    const userCollection = await users();
    const user = await userCollection.findOne({ username: username.toLowerCase() });
    if (!user) throw 'Data/Users.js/getByUsername: User not found!';
    user._id = user._id.toString();
    return user;
  },

  async getByEmail(email) {
    if (!email || typeof email !== "string" || !email.trim()) throw 'Data/Users.js/getByEmail: Invalid email';
    const userCollection = await users();
    const user = await userCollection.findOne({ email: email.toLowerCase() });
    if (!user) throw 'Data/Users.js/getByEmail: User not found!';
    user._id = user._id.toString();
    return user;
  },

  async add(user) {
    // TODO: Get default profile pic, use as default if not provided
    //       See GridFS, Mongoose, HTML (type="image") for uploading image to server and storing here

    if (!user.username || typeof user.username !== "string" || !user.username.trim()) throw "Data/Users.js/add: Invalid username!";
    if (!user.firstName || typeof user.firstName !== "string" || !user.firstName.trim()) throw "Data/Users.js/add: Invalid first name!";
    if (!user.lastName || typeof user.lastName !== "string" || !user.lastName.trim()) throw "Data/Users.js/add: Invalid last name!";
    if (!user.email || typeof user.email !== "string" || !user.email.trim()) throw "Data/Users.js/add: Invalid email!";
    if (!user.hashedPassword || typeof user.hashedPassword !== "string" || !user.hashedPassword.trim()) throw "Data/Users.js/add: Invalid hashed password!";
    if (!user.bio || typeof user.bio !== "string" || !user.bio.trim()) throw "Data/Users.js/add: Invalid bio!";
    user.username = user.username.toLowerCase();
    user.email = user.email.toLowerCase();
    const userCollection = await users();
    const newInsertInformation = await userCollection.insertOne(user);
    if (newInsertInformation.insertedCount === 0) throw 'Data/Users.js/add: Insert failed!';
    return await this.getById(newInsertInformation.insertedId.toString());
  },

  async update(id, user) {
    if (!id || typeof id !== "string" || !id.trim()) throw 'Data/Users.js/update: Invalid id!';
    if (!user.username || typeof user.username !== "string" || !user.username.trim()) throw "Data/Users.js/add: Invalid username!";
    if (!user.firstName || typeof user.firstName !== "string" || !user.firstName.trim()) throw "Data/Users.js/add: Invalid first name!";
    if (!user.lastName || typeof user.lastName !== "string" || !user.lastName.trim()) throw "Data/Users.js/add: Invalid last name!";
    if (!user.email || typeof user.email !== "string" || !user.email.trim()) throw "Data/Users.js/add: Invalid email!";
    if (!user.hashedPassword || typeof user.hashedPassword !== "string" || !user.hashedPassword.trim()) throw "Data/Users.js/add: Invalid hashed password!";
    if (!user.bio || typeof user.bio !== "string" || !user.bio.trim()) throw "Data/Users.js/add: Invalid bio!";
    user.username = user.username.toLowerCase();
    user.email = user.email.toLowerCase();
    const parsedId = ObjectId(id);
    const user = await this.getById(id);
    const userCollection = await users();
    const updateInfo = await userCollection.updateOne(
      { _id: parsedId },
      { $set: userUpdateInfo }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Data/Users.js/update: Update failed!';

    return await this.getById(id.toString());
  },

  async addReviewToUser(userId, reviewId) {
    if (!userId) throw 'Data/Users.js/addReviewToUser: You must provide a User id!';
    if (typeof userId !== "string") throw 'Data/Users.js/addReviewToUser: UserID needs to be a string!';
    const parsedId = ObjectId(userId);

    if (!reviewId) throw 'Data/Users.js/addReviewToUser: You must provide an Review id!';
    if (typeof reviewId !== "string") throw 'Data/Users.js/addReviewToUser: ReviewID needs to be a string!';

    const userCollection = await users();
    const updateInfo = await userCollection.updateOne(
      { _id: parsedId },
      { $addToSet: { reviews: reviewId } }
    );

    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Data/Users.js/addReviewToUser: Update failed!';

    return await this.getById(userId);
  },

  async addCommentToUser(userId, commentId) {
    if (!userId) throw 'Data/Users.js/addCommentToUser: You must provide a User id!';
    if (typeof userId !== "string") throw 'Data/Users.js/addCommentToUser: UserID needs to be a string!';
    const parsedId = ObjectId(userId);

    if (!commentId) throw 'Data/Users.js/addCommentToUser: You must provide an Comment id!';
    if (typeof commentId !== "string") throw 'Data/Users.js/addCommentToUser: CommentID needs to be a string!';

    const userCollection = await users();
    const updateInfo = await userCollection.updateOne(
      { _id: parsedId },
      { $addToSet: { comments: commentId } }
    );

    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Data/Users.js/addCommentToUser: Update failed!';

    return await this.getById(userId);
  },

  async delete(id) {
    if (!id) throw 'Data/Users.js/delete: You must provide an id!';
    if (typeof id !== "string") throw 'Data/Users.js/delete: ID needs to be a string!';
    const parsedId = ObjectId(id);

    const user = await this.getById(id);
    user.reviews.forEach(async r => {
      await reviews.removeReview(r);
    });
    user.comments.foreach(async c => {
      await comments.removeComment(c);
    });

    const userCollection = await users();
    const deletionInfo = await userCollection.removeOne({ _id: parsedId });
    if (deletionInfo.deletedCount === 0) throw `Data/Users.js/delete: Could not delete user with id of ${parsedId}!`;

    return true;
  },

  async removeReviewFromUser(userId, reviewId) {
    if (!userId) throw 'Data/Users.js/removeReviewFromUser: You must provide an User id';
    if (typeof userId !== "string") throw 'Data/Users.js/removeReviewFromUser: UserID needs to be a string!';
    const parsedId = ObjectId(userId);

    if (!reviewId) throw 'Data/Users.js/removeReviewFromUser: You must provide an Review id';
    if (typeof reviewId !== "string") throw 'Data/Users.js/removeReviewFromUser: ReviewID needs to be a string!';

    const userCollection = await users();
    const updateInfo = await userCollection.updateOne(
      { _id: parsedId },
      { $pull: { reviews: reviewId } }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Data/Users.js/removeReviewFromUser: Update failed!';

    return await this.getById(userId);
  },

  async removeCommentFromUser(userId, commentId) {
    if (!userId) throw 'Data/Users.js/removeCommentFromUser: You must provide an User id';
    if (typeof userId !== "string") throw 'Data/Users.js/removeCommentFromUser: UserID needs to be a string!';
    const parsedId = ObjectId(userId);

    if (!commentId) throw 'Data/Users.js/removeCommentFromUser: You must provide an Comment id';
    if (typeof commentId !== "string") throw 'Data/Users.js/removeCommentFromUser: CommentID needs to be a string!';

    const userCollection = await users();
    const updateInfo = await userCollection.updateOne(
      { _id: parsedId },
      { $pull: { comments: commentId } }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Data/Users.js/removeCommentFromUser: Update failed!';

    return await this.getById(userId);
  }
}

module.exports = exportedMethods;