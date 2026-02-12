import mongoose from "mongoose";

export const requireAdmin = (req, res, next) => {
  if (req.auth.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};




export const selfOrAdmin = (req, res, next) => {
  const loggedInUserId = req.auth.id;
  const requestedId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(requestedId)) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  if (req.auth.role === "admin") {
    return next();
  }

  if (loggedInUserId.toString() !== requestedId.toString()) {
    return res.status(403).json({ message: "Access denied" });
  }

  next();
};

