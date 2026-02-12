import express from "express";
import categoryRoutes from "./routes/category.routes.js";
import menuRoutes from "./routes/menu.routes.js";
import userRoutes from "./routes/user.routes.js";
import orderRoutes from "./routes/order.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/public", express.static("public"));

app.get('/', (req, res) => {
    res.send("API is running...")
});

app.use("/api/categories", categoryRoutes);
app.use("/api/menus", menuRoutes);
app.use("/api", userRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/admin", adminRoutes);

export default app;
