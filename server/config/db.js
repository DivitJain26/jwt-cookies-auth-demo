import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}`)
        console.log(`MongoDB connected`)
    } catch (error) {
        console.log("MongoDB connection error", error)
    }
}

export default connectDB