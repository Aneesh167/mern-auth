import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./route/authRoute.js";
import userRouter from "./route/userRoute.js";
import jwt from "jsonwebtoken"; // ADD THIS IMPORT

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

// ADD DEBUG ENDPOINT RIGHT HERE
app.get("/api/debug-secret", (req, res) => {
  const testPayload = { id: "test123" };

  // Create a token with current secret
  const token = jwt.sign(testPayload, process.env.JWT_SECRET);
  console.log("Generated token with current secret:", token);

  // Try to verify it
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({
      success: true,
      message: "JWT secret is working",
      secretExists: !!process.env.JWT_SECRET,
      token: token,
      decoded: decoded,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "JWT secret error: " + error.message,
      secretExists: !!process.env.JWT_SECRET,
    });
  }
});

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
