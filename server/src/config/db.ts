import mongoose from "mongoose";
import { getEnv } from "../utils/env";

const connectDB = async () => {
    try {
        await mongoose.connect(`${getEnv('MONGODB_URI')}`)
        console.log(`MongoDB connected`)
    } catch (error) {
        console.log("MongoDB connection error", error)
    }
}

export default connectDB