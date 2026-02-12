import menuModel from "../models/menu.model.js";
import orderModel from "../models/order.model.js";


export const getDashboardStats = async (req, res) => {
    try {
        const totalMenus = await menuModel.countDocuments();
        const totalOrders = await orderModel.countDocuments();

        const orders = await orderModel.find();

        let totalRevenue = 0;

        const weeklyMap = {
            Mon: { day: "Mon", revenue: 0, orders: 0 },
            Tue: { day: "Tue", revenue: 0, orders: 0 },
            Wed: { day: "Wed", revenue: 0, orders: 0 },
            Thu: { day: "Thu", revenue: 0, orders: 0 },
            Fri: { day: "Fri", revenue: 0, orders: 0 },
            Sat: { day: "Sat", revenue: 0, orders: 0 },
            Sun: { day: "Sun", revenue: 0, orders: 0 },
        };

        orders.forEach((order) => {
            if (!order.createdAt) return;
            const day = new Date(order.createdAt).toLocaleDateString("en-US", {
                weekday: "short",
            });

            if (!weeklyMap[day]) return;

            weeklyMap[day].orders += 1;

            if (order.status?.toLowerCase() === "delivered") {
                // totalRevenue += order.pricing?.total || 0;
                // weeklyMap[day].revenue += order.pricing?.total || 0;

                const amount = order.pricing?.total || 0;
                totalRevenue += amount;
                weeklyMap[day].revenue += amount;
            }

            console.log("Status:", order.status);
            console.log("Pricing:", order.pricing);
        });

        res.json({
            totalMenus,
            totalOrders,
            revenue: totalRevenue,
            orders,
            weeklyData: Object.values(weeklyMap),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
