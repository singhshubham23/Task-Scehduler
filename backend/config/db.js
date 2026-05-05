const mongoose = require('mongoose');

const getMongoConfig = () => {
  const mongoUri =
    process.env.MONGO_URI || process.env.MONGODB_URI || process.env.MONGO_URL || '';
  const mongoDbName = process.env.MONGO_DB_NAME || process.env.MONGODB_DB || '';

  if (!mongoUri) {
    throw new Error(
      'Mongo URI is missing. Set MONGO_URI in backend/.env with your MongoDB Compass connection string.'
    );
  }

  return { mongoUri, mongoDbName };
};

const connectDB = async () => {
  try {
    const { mongoUri, mongoDbName } = getMongoConfig();
    const connectOptions = mongoDbName ? { dbName: mongoDbName } : {};

    const conn = await mongoose.connect(mongoUri, connectOptions);
    console.log(`MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
