import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  // ADD DETAILED DEBUGGING
  console.log("=== AUTH MIDDLEWARE DEBUG ===");
  console.log("Request URL:", req.url);
  console.log("Request method:", req.method);
  console.log("All cookies received:", req.cookies);
  console.log("Token cookie exists:", !!req.cookies.token);
  console.log("Request origin:", req.headers.origin);
  console.log("Request headers:", {
    cookie: req.headers.cookie,
    authorization: req.headers.authorization,
  });

  const { token } = req.cookies;

  if (!token) {
    console.log("❌ NO TOKEN FOUND - This is the problem!");
    console.log("Available cookies:", Object.keys(req.cookies));
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Login Again",
    });
  }

  console.log("✅ Token found:", token.substring(0, 20) + "...");

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token decoded successfully");

    if (tokenDecode.id) {
      req.userId = tokenDecode.id;
      console.log("✅ Authentication successful");
      next();
    } else {
      console.log("❌ Token missing user ID");
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Login Again",
      });
    }
  } catch (error) {
    console.log("❌ JWT verification failed:", error.message);
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Login Again",
    });
  }
};

export default userAuth;
