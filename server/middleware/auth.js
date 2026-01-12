import jwt from "jsonwebtoken";
import User from "../model/userMlodel.js";

const authenticate = async (req, res, next) => {
  // Try to get token from Authorization header first
  let token = null;
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    // Fallback to cookie if Authorization header not found
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ message: "No token provided", success: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded._id).select("-password");
    if (!req.user) {
      return res.status(401).json({ message: "User not found", success: false });
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token", success: false });
  }
};

export default authenticate;
