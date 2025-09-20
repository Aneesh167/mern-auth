import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;

  console.log("Cookies received:", req.cookies);
  console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);

  if (!token) {
    console.log("No token found in cookies");
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Login Again",
    });
  }

  try {
    console.log("Token found, attempting verification...");
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decoded successfully:", tokenDecode);

    if (tokenDecode.id) {
      req.userId = tokenDecode.id;
      next();
    } else {
      console.log("Token decode failed - no id found");
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Login Again",
      });
    }
  } catch (error) {
    console.log("JWT verification error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Login Again",
    });
  }
};

export default userAuth;
