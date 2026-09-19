import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import {router} from "./routes/userRoutes.js"
import { propertyRouter } from "./routes/propertyRouter.js";
import { bookingRouter } from "./routes/bookingRouter.js";
import { tripRouter } from "./routes/tripRouter.js";


import connectDB from "./utils/db.js";

dotenv.config();

const app = express();

// Trust reverse proxy for secure cookies on Render/cloud
app.set("trust proxy", 1);

// Production-ready CORS supporting Netlify, local dev, and custom domains
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5174",
  "https://homelyhub0.netlify.app",
  ...(process.env.ORIGIN_ACCESS_URL
    ? process.env.ORIGIN_ACCESS_URL.split(",").map((s) => s.trim().replace(/\/$/, ""))
    : []),
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      const cleanOrigin = origin.replace(/\/$/, "");
      if (
        allowedOrigins.includes(cleanOrigin) ||
        cleanOrigin.endsWith(".netlify.app") ||
        cleanOrigin.endsWith(".onrender.com") ||
        /^http:\/\/localhost:\d+$/.test(cleanOrigin)
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive reflection for deployment
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  })
);

//express.json
app.use(express.json({limit:"100mb"}))

//urlencoded
app.use(express.urlencoded({limit:"100mb", extended:true}))

//cookieParser
app.use(cookieParser())

const port = process.env.PORT;


//test route
app.get("/",(req,res)=>{
    res.send("Homelyhub server is running")
})

app.use("/api/v1/rent/user",router)
app.use("/api/v1/rent/listing",propertyRouter)
app.use("/api/v1/rent/user/booking", bookingRouter)
app.use("/api/v1/rent/trip", tripRouter)


connectDB();

app.listen(port,()=>{
    console.log(`App is running on port no: ${port}`);
})