import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  // ADD DEBUGGING AT THE VERY START
  console.log("=== AUTH MIDDLEWARE TRIGGERED ===");
  console.log("Request URL:", req.url);
  console.log("Request cookies:", req.cookies);
  console.log("Request headers:", req.headers);

  const { token } = req.cookies;

  if (!token) {
    console.log("❌ NO TOKEN FOUND IN COOKIES");
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Login Again",
    });
  }

  console.log("✅ Token found:", token);

  try {
    // Debug JWT secret
    console.log("JWT_SECRET:", process.env.JWT_SECRET ? "Exists" : "MISSING!");

    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token decoded successfully:", tokenDecode);

    if (tokenDecode.id) {
      req.userId = tokenDecode.id;
      console.log("✅ Authentication successful, proceeding...");
      next();
    } else {
      console.log("❌ Token decode failed - no user id found");
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Login Again",
      });
    }
  } catch (error) {
    console.log("❌ JWT verification error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Login Again",
    });
  }
};

export default userAuth;
