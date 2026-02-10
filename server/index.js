import dotenv from "dotenv";
dotenv.config(); 
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import {v2 as cloudinary } from "cloudinary";
import authRoute from "./routes/auth.routes.js";
import userRoute from "./routes/user.routes.js";
import postRoute from "./routes/post.routes.js";
import messageRoute from "./routes/message.routes.js";
import applicationRoute from "./routes/application.routes.js";
import analysisRoute from "./routes/analysis.routes.js";
import { app, server } from "./config/socket.js";

// Request Logger Middleware
app.use((req, res, next) => {

  next();
});

app.use(express.json({ limit: '10mb' }));
app.set('trust proxy', 1); // Trust proxy headers from Render
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PUT" , "PATCH"],
  })
);

app.use(express.urlencoded({ extended: true }));
// app.use(cors())



cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ EXPORT CLOUDINARY OBJECT
export { cloudinary };


app.use("/api/auth", authRoute);
app.use("/api/message", messageRoute);
app.use("/api/user", userRoute);
app.use("/api/post", postRoute);
app.use("/api/application", applicationRoute);
app.use("/api/analysis", analysisRoute);

connectDB();

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running on Port:${port}`);
});
