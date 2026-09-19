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

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Requested-With, Accept"
    );
  }
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

app.use(
  cors({
    origin: true,
    credentials: true,
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