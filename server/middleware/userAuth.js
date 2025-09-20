import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({
      // Add status code
      success: false,
      message: "Unauthorized: Login Again",
    });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    if (tokenDecode.id) {
      req.userId = tokenDecode.id;
      next();
    } else {
      return res.status(401).json({
        // Add status code
        success: false,
        message: "Unauthorized: Login Again",
      });
    }
  } catch (error) {
    return res.status(401).json({
      // Add status code and return
      success: false,
      message: "Unauthorized: Login Again",
    });
  }
};

export default userAuth;
