import mongoose from "mongoose";
const connectToDatabase = async () => {
  const MONGODB_URI = process.env.MONGODB_URI;
  try {
    const connectionResponse = await mongoose.connect(MONGODB_URI);
     console.log(`MongoDB connected: ${connectionResponse.connection.host}`);
  } catch (error) {
    console.log(`MongoDB connection error: ${error}`);
  }
};

export default connectToDatabase;
