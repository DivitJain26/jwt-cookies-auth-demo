import dotenv from "dotenv"
import { app } from "./src/app.js";
import connectDB from "./src/config/db.js"

dotenv.config({
    path: "./.env"
})

const PORT = process.env.PORT || 5000

connectDB()
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`)
        console.log(
            `CORS_ORIGIN = ${process.env.CORS_ORIGIN}`,
            `MONGODB_URI = ${process.env.MONGODB_URI}`,
            `JWT_ACCESS_TOKEN_SECRET = ${process.env.JWT_ACCESS_TOKEN_SECRET}`,
           `JWT_REFRESH_TOKEN_SECRET = ${process.env.JWT_REFRESH_TOKEN_SECRET}`,
        )
    }) 
})
.catch((err) => {
    console.log(`MongoDB connection error`, err)
})

 