const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const {ObjectId} = require("mongodb");

const exportedMethods = {
    async getById(id) {
        if (!id) throw 'Data/Users.js/getById: You must provide an id to search for!';
        if (typeof id !== "string") throw 'Data/Users.js/getById: ID needs to be a string!';
        const parsedId = ObjectId(id);
    
        const userCollection = await users();
        const user = await userCollection.findOne({ _id: parsedId });
        if (!user) throw 'Data/Users.js/getById: User not found!';
        return user;
    },

    async getAll() {
        const userCollection = await users();
        const userList = await userCollection.find({}).toArray();
        if (!userList) throw 'Data/Users.js/getAll: No users in system!';
        return userList;
    },

    async add(username, firstName, lastName, email, hashedPassword, bio, profilePic) {
        // TODO: Get default profile pic, use as default if not provided
        //       See GridFS, Mongoose, HTML (type="image") for uploading image to server and storing here

        if (!username || !firstName || !lastName || !email || !hashedPassword || !bio || !profilePic) throw "Data Users.js: Missing Input Field!";
        
        if (typeof username !== "string") throw "Data/Users.js/add: Username must be a string!";
        if (typeof firstName !== "string") throw "Data/Users.js/add: FirstName must be a string!";
        if (typeof lastName !== "string") throw "Data/Users.js/add: LastName must be a string!";
        if (typeof email !== "string") throw "Data/Users.js/add: Email must be a string!";
        if (typeof hashedPassword !== "string") throw "Data/Users.js/add: HashedPassword must be a string!";
        if (typeof bio !== "string") throw "Data/Users.js/add: Bio must be a string!";
        // Profile Pic

        if (!username.trim()) throw "Data/Users.js/add: Username cannot be empty!";
        if (!firstName.trim()) throw "Data/Users.js/add: FirstName cannot be empty!";
        if (!lastName.trim()) throw "Data/Users.js/add: LastName cannot be empty!";
        if (!email.trim()) throw "Data/Users.js/add: Email cannot be empty!";
        if (!hashedPassword.trim()) throw "Data/Users.js/add: HashedPassword cannot be empty!";
        if (!bio.trim()) throw "Data/Users.js/add: Bio cannot be empty!";
        // Profile Pic

        const userCollection = await users();

        const newUser = {
            username: username,
            firstName: firstName,
            lastName: lastName,
            email: email,
            hashedPassword: hashedPassword,
            bio: bio,
            profilePic: profilePic,
            reviews: [],
            comments: []
        };
    
        const newInsertInformation = await userCollection.insertOne(newUser);
        if (newInsertInformation.insertedCount === 0) throw 'Data/Users.js/add: Insert failed!';
        return await this.readById(newInsertInformation.insertedId.toString());
    },

    async update(id, updatedUser) {
        if (!id) throw 'Data/Users.js/update: You must provide an id!';
        if (typeof id !== "string") throw 'Data/Users.js/update: ID needs to be a string!';
        const parsedId = ObjectId(id);
    
        const user = await this.readById(id);

        const userUpdateInfo = {
          username: updatedUser.username,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          hashedPassword: updatedUser.hashedPassword,
          bio: updatedUser.bio,
          profilePic: updatedUser.profilePic,
          reviews: user.reviews,
          comments: user.comments
        };
    
        const userCollection = await users();
        const updateInfo = await userCollection.updateOne(
          { _id: parsedId },
          { $set: userUpdateInfo }
        );
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Data/Users.js/update: Update failed!';

        return await this.readById(id.toString());
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

        return await this.readById(userId);
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

        return await this.readById(userId);
    },

    async delete(id) {
        if (!id) throw 'Data/Users.js/delete: You must provide an id!';
        if (typeof id !== "string") throw 'Data/Users.js/delete: ID needs to be a string!';
        const parsedId = ObjectId(id);
    
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

        return await this.readById(userId);
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

        return await this.readById(userId);
    }
}

module.exports = exportedMethods;