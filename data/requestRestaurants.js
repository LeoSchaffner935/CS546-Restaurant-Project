const mongoCollections = require('../config/mongoCollections');
const requestRestaurants = mongoCollections.requestRestaurants;
const { ObjectId } = require("mongodb");

async function getAllRestaurants() {
    const rRestaurantsCollection = await requestRestaurants();
    return await rRestaurantsCollection.find({}).toArray();
}

async function getRestaurantById(id) {
    if (!id) throw 'id cannot be undefined';
    if (typeof id !== "string") throw 'id must be of type string';
    const parsedId = ObjectId(id);
    const rRestaurantsCollection = await requestRestaurants();
    const restaurant = await rRestaurantsCollection.findOne({ _id: parsedId });
    if (restaurant == undefined) throw 'restaurant does not exist with the given id';
    restaurant._id = restaurant._id.toString();
    return restaurant;
}

async function addRestaurant(restaurant) {
    if (!restaurant) throw 'restaurant cannot be undefined';
    if (!restaurant.name || typeof restaurant.name !== "string" || !restaurant.name.trim()) throw 'Invalid restaurant name';
    if (!restaurant.location || typeof restaurant.location !== "string" || !restaurant.location.trim()) throw 'Invalid restaurant location';
    if (!restaurant.contact || typeof restaurant.contact !== "string" || !restaurant.contact.trim()) throw 'Invalid restaurant contact';
    if (!restaurant.reason || typeof restaurant.reason !== "string" || !restaurant.reason.trim()) throw 'Invalid restaurant reason';

    const rRestaurantsCollection = await requestRestaurants();
    const insertInfo = await rRestaurantsCollection.insertOne(restaurant);
    if (insertInfo.insertedCount === 0) throw 'Insertion failed!';
    
    return await this.getRestaurantById(insertInfo.insertedId.toString());
}

async function removeRestaurant(id) {
    let parsedId = ObjectId(id);
    const rRestaurantsCollection = await requestRestaurants();
    const deletionInfo = await rRestaurantsCollection.removeOne({ _id: parsedId });
    if (deletionInfo.deletedCount === 0) throw 'Deletion failed!';
}

module.exports = { getAllRestaurants, getRestaurantById, addRestaurant, removeRestaurant}
