import dotenv from "dotenv" 
import { app } from "./app.js";
import connectDB from "./config/db.js"
import { getEnv } from "./utils/env.js";

dotenv.config({
    path: "./.env"
})

const PORT = getEnv('PORT') || 5000

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on ${PORT}`)
        })
    })
    .catch((err) => {
        console.log(`MongoDB connection error`, err) 
    })

// console.log(
//     `CORS_ORIGIN = ${process.env.CORS_ORIGIN}`,
//     `MONGODB_URI = ${process.env.MONGODB_URI}`,
//     `JWT_ACCESS_TOKEN_SECRET = ${process.env.JWT_ACCESS_TOKEN_SECRET}`,
//     `JWT_REFRESH_TOKEN_SECRET = ${process.env.JWT_REFRESH_TOKEN_SECRET}`,
// )