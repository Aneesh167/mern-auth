import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.json({ success: false, message: "Unauthorized: Login Again" });
  }
  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    if (tokenDecode.id) {
      if (!req.body) req.body = {};
      req.userId = tokenDecode.id; // Simplified - no need to check/create req.body
      next();
    } else {
      return res.json({ success: false, message: "Unauthorized: Login Again" });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export default userAuth;
