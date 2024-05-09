const mongoose = require("mongoose");

const MONGO_URL = process.env.MONGODB_URI;

const connectDB = async () => {
    try {
    const con = await mongoose.connect(MONGO_URL);
    console.log(`MongoDB connected: ${con.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
