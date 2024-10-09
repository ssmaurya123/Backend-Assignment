import mongoose from "mongoose";

// COnnecting MongoDb
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected succesfully");
  } catch (error) {
    console.log(error);
  }
};
export default connectDB;
