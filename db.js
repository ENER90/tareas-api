const mongoose = require("mongoose");

const connectDB = async () => {
  if (!process.env.MONGO_DB_URL) throw new Error("Database URL is missing");

  try {
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log("Database connected successfully...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
