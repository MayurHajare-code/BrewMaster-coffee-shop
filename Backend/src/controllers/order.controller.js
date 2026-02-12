import mongoose from "mongoose";
import Order from "../models/order.model.js";




export const createOrder = async (req, res) => {
    const userId = req.user?.id || req.user?._id || req.auth?.id;

    try {
        const {
            items,
            pricing,
            customer,
            deliveryDate,
            paymentMethod,
        } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        const normalizedItems = items.map((item) => ({
            _id: new mongoose.Types.ObjectId(),     // ✅ unique per item
            productId: item.productId,
            name: item.name,                       // always store name
            price: item.price,
            quantity: item.quantity,
            image: item.image?.url,
        }));

        // console.log("USER ID:", userId);
        // console.log("ITEMS:", items);
        // console.log("PRICING:", pricing);
        // console.log("CUSTOMER:", customer);
        // console.log("DELIVERY DATE:", deliveryDate);

        const order = await Order.create({
            user: userId,
            items: normalizedItems,
            pricing,
            customer,
            deliveryDate,
            payment: {
                method: paymentMethod,
                status: paymentMethod === "cod" ? "pending" : "paid",
            },
        });

        res.status(201).json({
            success: true,
            order,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Order failed" });
    }
};


// export const getMyOrders = async (req, res) => {
//     const orders = await Order.find({ user: req.auth.id })
//         .sort({ createdAt: -1 });

//     res.json({
//         success: true,
//         count: orders.length,
//         orders,
//     });
// };





export const getOrdersByUserId = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.params.id })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: orders.length,
            orders,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch orders" });
    }
};



export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
        // .populate("user", "name email phone address");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        // 🔐 Ownership check
        if (
            order.user.toString() !== req.auth.id &&
            req.auth.role !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "Access denied",
            });
        }



        res.json({
            success: true,
            order,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch order",
        });
    }
};


// user side
export const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }



        // Make sure order belongs to logged-in user
        if (order.user.toString() !== req.auth.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        // Prevent cancelling shipped/delivered orders
        if (order.payment.status !== "pending") {
            return res
                .status(400)
                .json({ message: "Order cannot be cancelled" });
        }

        order.payment.status = "cancelled";
        order.cancelledBy = "user";
        order.cancelledAt = new Date();
        order.status = "cancelled by user"

        await order.save();

        res.status(200).json({
            success: true,
            message: "Order cancelled successfully",
            order,
        });
    } catch (error) {
        console.error("Cancel order error:", error);
        res.status(500).json({ message: "Server error" });
    }
};



export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            orders,
        });
    } catch (error) {
        console.error("Get all orders error:", error);
        res.status(500).json({ message: "Server error" });
    }
};


//admin side
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.orderId);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (status === "cancelled") {
            order.status = "cancelled by admin";
        } else {
            order.status = status;
        }
        // console.log(order.status);


        // COD auto-payment on delivery
        if (status === "delivered" && order.payment.method === "cod") {
            order.payment.status = "paid";
            order.paymentUpdatedAt = new Date();
        }

        await order.save();

        res.status(200).json({
            success: true,
            message: "Order updated",
            order,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Update failed" });
    }
};
