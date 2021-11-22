// Get the mongoose object
import mongoose from 'mongoose';

// Prepare to the database hikes_db in the MongoDB server running locally on port 27017
mongoose.connect(
    'mongodb://localhost:27017/hikes_db',
    { useNewUrlParser: true }
);

// Connect to to the database
const db = mongoose.connection;

// The open event is called when the database connection successfully opens
db.once('open', () => {
    console.log('Successfully connected to MongoDB using Mongoose!');
});

// Tell mongoose to create indexes, which help with faster querying
mongoose.set('useCreateIndex', true);

/**
 * Define the schema
 */
const hikeSchema = mongoose.Schema({
    zipcode: { type: Number, required: true},
    name: { type: String, required: true },
    length: { type: Number, required: true },
    difficulty: { type: Number, required: true },
    topFive: { type: String, required: true }
});

/**
 * Compile the model from the schema. This must be done after defining the schema.
 */
const Hike = mongoose.model("Hike", hikeSchema);

/**
 * Create a hike
 * @param {Number} zipcode
 * @param {String} name
 * @param {Number} length 
 * @param {Number} difficulty
 * @param {String} topFive
 * @returns A promise. Resolves to the JSON object for the document created by calling save
 */
const createHike = async (zipcode, name, length, difficulty, topFive) => {
    // Call the constructor to create an instance of the model class Hike
    const hike = new Hike({ zipcode: zipcode, name: name, length: length, difficulty: difficulty, topFive: topFive });
    // Call save to persist this object as a document in MongoDB
    return hike.save();
}

/**
 * Retrive users based on the filter, projection and limit parameters
 * @param {Object} filter 
 * @param {String} projection 
 * @param {Number} limit 
 * @returns 
 */
const findHikes = async (filter, projection, limit) => {
    const query = Hike.find(filter)
        .select(projection)
        .limit(limit);
    return query.exec();
}

/**
 * Replace the zipcode, name, length, difficulty and topFive properties if they are included in the query of the user with the id value provided
 * @param {String} _id
 * @param {Number} zipcode
 * @param {String} name
 * @param {Number} length
 * @param {Number} difficulty
 * @param {String} topFive
 * @returns A promise. Resolves to the number of documents modified
 */
const replaceHike = async (_id, zipcode, name, length, difficulty, topFive) => {
    const result = await Hike.replaceOne({ _id: _id },
        { zipcode: zipcode, name: name, length: length, difficulty: difficulty, topFive: topFive });
    return result.nModified;
}

const updateHike = async (_id, filter) => {
    const result = await Hike.updateOne({ _id: _id }, filter);
    return result.nModified;
}


/**
 * Delete the hike with provided id value
 * @param {String} _id 
 * @returns A promise. Resolves to the count of deleted documents
 */
const deleteById = async (_id) => {
    const result = await Hike.deleteOne({ _id: _id });
    // Return the count of deleted document. Since we called deleteOne, this will be either 0 or 1.
    return result.deletedCount;
}

const deleteByParam = async (filter) => {
    const result = await Hike.deleteMany(filter);
    // Return the count of deleted documents.
    return result.deletedCount;
}



export { createHike, findHikes, replaceHike, updateHike, deleteById, deleteByParam };