const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@perfume.iy1in.mongodb.net/?retryWrites=true&w=majority&appName=perfume`
    );

    console.log(`MongoDB connected`);
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
};

module.exports = connectDB;
