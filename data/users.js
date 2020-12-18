const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const { ObjectId } = require("mongodb");


async function getById(id) {
  if (!id || typeof id !== "string" || !id.trim()) throw 'Data/Users.js/getById: Invalid id!';
  const parsedId = ObjectId(id);
  const userCollection = await users();
  const user = await userCollection.findOne({ _id: parsedId });
  if (!user) throw 'Data/Users.js/getById: User not found!';
  user._id = user._id.toString();
  return user;
}

async function getAll() {
  const userCollection = await users();
  let usersList = await userCollection.find({}).toArray();
  for (user of usersList) {
    user._id = user._id.toString();
  }
  return usersList;
}

async function getByUsername(username) {
  if (!username || typeof username !== "string" || !username.trim()) throw 'Data/Users.js/getByUsername: Invalid username';
  const userCollection = await users();
  const user = await userCollection.findOne({ username: username.toLowerCase() });
  if (!user) throw 'Data/Users.js/getByUsername: User not found!';
  user._id = user._id.toString();
  return user;
}

async function getByEmail(email) {
  if (!email || typeof email !== "string" || !email.trim()) throw 'Data/Users.js/getByEmail: Invalid email';
  const userCollection = await users();
  const user = await userCollection.findOne({ email: email.toLowerCase() });
  if (!user) throw 'Data/Users.js/getByEmail: User not found!';
  user._id = user._id.toString();
  return user;
}

async function add(user) {
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
  user.profilePicture = "default.jpg";
  const userCollection = await users();



  const newInsertInformation = await userCollection.insertOne(user);
  if (newInsertInformation.insertedCount === 0) throw 'Data/Users.js/add: Insert failed!';
  return await this.getById(newInsertInformation.insertedId.toString());
}

async function update(id, user) {
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
  const userCollection = await users();

  const updateInfo = await userCollection.updateOne(
    { _id: parsedId },
    { $set: user }
  );
  if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Data/Users.js/update: Update failed!';

  return await this.getById(id);
}

async function addReviewToUser(userId, reviewId) {
  if (!userId || typeof userId !== "string" || !userId.trim()) throw 'Data/Users.js/addReviewToUser: Invalid userId!';
  if (!reviewId || typeof reviewId !== "string" || !reviewId.trim()) throw 'Data/Users.js/addReviewToUser: Invalid reviewId!';
  const parsedId = ObjectId(userId);
  const userCollection = await users();
  await userCollection.updateOne({ _id: parsedId }, { $addToSet: { reviews: reviewId } });
}

async function addCommentToUser(userId, commentId) {
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
}

async function removeReviewFromUser(userId, reviewId) {
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
}

async function removeCommentFromUser(userId, commentId) {
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


module.exports = { getById, getAll, getByUsername, getByEmail, add, update, addReviewToUser, addCommentToUser, removeReviewFromUser, removeCommentFromUser };
