
import jwt from "jsonwebtoken";

export const adminAuth = (req, res, next) => {
    const token = req.cookies.adminToken;

    if (!token) {
        return res.status(401).json({ message: "Not authenticated" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== "admin") {
            return res.status(403).json({ message: "Admin Forbidden" });
        }

        req.adminId = decoded.id;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};
