const mongoose = require("mongoose");

// MongoDB 連接
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB 連接成功");
  } catch (err) {
    console.error("MongoDB 連接失敗:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
