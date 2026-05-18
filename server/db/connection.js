import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/rti_management";

export const connectDatabase = async () => {
  if (mongoose.connection.readyState >= 1) return mongoose.connection.asPromise();
  mongoose.set("strictQuery", false);
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected");
    return conn;
  } catch (err) {
    console.error("MongoDB connection failed:", err.message || err);
    throw err;
  }
};

export const disconnectDatabase = async () => {
  if (mongoose.connection.readyState === 0) return;
  return mongoose.disconnect();
};

export const getDatabaseState = () => mongoose.connection.readyState;
