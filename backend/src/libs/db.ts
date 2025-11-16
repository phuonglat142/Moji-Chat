import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
        console.log("Connected to db successfully");
    } catch (error) {
        console.error("Failed to connect to db", error);
        process.exit(1);
    }
}