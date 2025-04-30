import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI!;

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`Mongodb connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Connection failed!", error);
    process.exit(1);
  }
};

export default connectDb;
