const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const {ObjectId} = require("mongodb");

const exportedMethods = {
    async getById(id) {
        if (!id) throw 'You must provide an id to search for!';
        if (typeof id !== "string") throw 'ID needs to be a string!';
        const parsedId = ObjectId(id);
    
        const userCollection = await users();
        const user = await userCollection.findOne({ _id: parsedId });
        if (!user) throw 'User not found!';
        return user;
    },

    async getAll() {
        const userCollection = await users();
        const userList = await userCollection.find({}).toArray();
        if (!userList) throw 'No users in system!';
        return userList;
    },

    async add(username, firstName, lastName, email, password, bio, profilePic) {
        // TODO: Error Checking
        //       Get default profile pic, use as default if not provided
        
        const userCollection = await users();

        const newUser = {
            username: username,
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password, // TODO: Encrypt password
            bio: bio,
            profilePic: profilePic,
            isOwner: false, // This privalege can be only enabled by admins
            reviews: [],
            comments: []
        };
    
        const newInsertInformation = await userCollection.insertOne(newUser);
        if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';
        return await this.readById(newInsertInformation.insertedId.toString());
    },

    async update(id, updatedUser) {
        if (!id) throw 'You must provide an id';
        if (typeof id !== "string") throw 'ID needs to be a string!';
        const parsedId = ObjectId(id);
    
        const user = await this.readById(id);

        const userUpdateInfo = {
          username: updatedUser.username,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          password: updatedUser.password,
          bio: updatedUser.bio,
          profilePic: updatedUser.profilePic,
          isOwner: updateUser.isOwner,
          reviews: user.reviews,
          comments: user.comments
        };
    
        const userCollection = await users();
        const updateInfo = await userCollection.updateOne(
          { _id: parsedId },
          { $set: userUpdateInfo }
        );
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed!';

        return await this.readById(id.toString());
    },

    async addReviewToUser(userId, reviewId) {
        if (!userId) throw 'You must provide a User id!';
        if (typeof userId !== "string") throw 'UserID needs to be a string!';
        const parsedId = ObjectId(userId);

        if (!reviewId) throw 'You must provide an Review id!';
        if (typeof reviewId !== "string") throw 'ReviewID needs to be a string!';
    
        const userCollection = await users();
        const updateInfo = await userCollection.updateOne(
          { _id: parsedId },
          { $addToSet: { reviews: reviewId } }
        );
    
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed!';

        return await this.readById(userId);
    },

    async addCommentToUser(userId, commentId) {
        if (!userId) throw 'You must provide a User id!';
        if (typeof userId !== "string") throw 'UserID needs to be a string!';
        const parsedId = ObjectId(userId);

        if (!commentId) throw 'You must provide an Comment id!';
        if (typeof commentId !== "string") throw 'CommentID needs to be a string!';
    
        const userCollection = await users();
        const updateInfo = await userCollection.updateOne(
          { _id: parsedId },
          { $addToSet: { comments: commentId } }
        );
    
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed!';

        return await this.readById(userId);
    },

    async delete(id) {
        if (!id) throw 'You must provide an id!';
        if (typeof id !== "string") throw 'ID needs to be a string!';
        const parsedId = ObjectId(id);
    
        const userCollection = await users();
        const deletionInfo = await userCollection.removeOne({ _id: parsedId });
        if (deletionInfo.deletedCount === 0) throw `Could not delete user with id of ${parsedId}!`;
        
        return true;
    },

    async removeReviewFromUser(userId, reviewId) {
        if (!userId) throw 'You must provide an User id';
        if (typeof userId !== "string") throw 'UserID needs to be a string!';
        const parsedId = ObjectId(userId);

        if (!reviewId) throw 'You must provide an Review id';
        if (typeof reviewId !== "string") throw 'ReviewID needs to be a string!';
    
        const userCollection = await users();
        const updateInfo = await userCollection.updateOne(
          { _id: parsedId },
          { $pull: { reviews: reviewId } }
        );
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed!';

        return await this.readById(userId);
    },

    async removeCommentFromUser(userId, commentId) {
        if (!userId) throw 'You must provide an User id';
        if (typeof userId !== "string") throw 'UserID needs to be a string!';
        const parsedId = ObjectId(userId);

        if (!commentId) throw 'You must provide an Comment id';
        if (typeof commentId !== "string") throw 'CommentID needs to be a string!';
    
        const userCollection = await users();
        const updateInfo = await userCollection.updateOne(
          { _id: parsedId },
          { $pull: { comments: commentId } }
        );
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed!';

        return await this.readById(userId);
    }
}

module.exports = exportedMethods;