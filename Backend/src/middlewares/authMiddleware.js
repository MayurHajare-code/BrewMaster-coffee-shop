import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const token = req.cookies.authToken; 

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.auth = decoded; // here i get id and role

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;



