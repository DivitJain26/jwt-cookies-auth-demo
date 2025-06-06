import dotenv from "dotenv"
import { app } from "./app.js";
import connectDB from "./config/db.js"

dotenv.config({
    path: "./.env"
})

const PORT = process.env.PORT || 5000

connectDB()
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`)
    }) 
})
.catch((err) => {
    console.log(`MongoDB connection error`, err)
})

 