import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./route/authRoute.js";
import userRouter from "./route/userRoute.js";

const app = express();
const port = process.env.PORT || 5000;
connectDB();
const allowedOrigins = [
  "https://authentication-frontend-zwwk.onrender.com",
  "http://localhost:5173",
];

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));
console.log("Environment variables loaded:");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "Exists" : "MISSING");
console.log("NODE_ENV:", process.env.NODE_ENV);
// Test CORS route
app.get("/test-cors", (req, res) => {
  res.json({ success: true, message: "CORS is working!" });
});
// Api Endpoints
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
