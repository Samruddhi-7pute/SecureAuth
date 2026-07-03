const mongoose = require('mongoose');
const { MONGO_URI, NODE_ENV } = require('./env');
const { MongoMemoryServer } = require('mongodb-memory-server');

/**
 * Connects to MongoDB Atlas. Falls back to an in-memory MongoDB instance in
 * development when no MONGO_URI is configured.
 */
const connectDB = async () => {
  try {
    let uri = MONGO_URI;

    if (!uri && NODE_ENV === 'development') {
      const mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
      console.log(`Using in-memory MongoDB for development at ${uri}`);
    }

    if (!uri) {
      throw new Error('Missing MongoDB connection URI. Set MONGO_URI in .env.');
    }

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${conn.connection.host}`);

    mongoose.connection.on('error', (err) => {
      console.error(`MongoDB connection error: ${err.message}`);
    });
  } catch (error) {
    console.error(`Failed to connect to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
