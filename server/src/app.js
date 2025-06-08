import express from "express"
import cors from "cors"
import dotenv from "dotenv";
import cookieParser from "cookie-parser"
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';



// import routes
import authRoutes from "./routes/auth.route.js"

dotenv.config();

const app = express()

app.use(
    cors({
        origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
        credentials: true
    }) 
)

// middleware
// Apply rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use('/api', limiter);

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())
app.use(helmet());
app.use(morgan('dev')); // logs method, URL, status, response time, etc.


// routes
app.use("/api/auth", authRoutes)

export { app }