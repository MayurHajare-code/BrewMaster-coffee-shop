import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { cancelOrder, createOrder, getAllOrders, getOrderById, getOrdersByUserId, updateOrderStatus } from '../controllers/order.controller.js';
import { requireAdmin, selfOrAdmin } from '../middlewares/AdminOnly.js';

const router = express.Router();

router.post("/",
    authMiddleware,
    createOrder);

// router.get("/myorder",
//     authMiddleware,
//     getMyOrders);

router.get("/myorder/:id",
    authMiddleware,
    selfOrAdmin,
    getOrdersByUserId);

router.get(
    "/:orderId",
    authMiddleware,
    getOrderById
);

router.patch("/:orderId/cancel", authMiddleware, cancelOrder);

router.get("/", authMiddleware, requireAdmin, getAllOrders);


router.patch("/:orderId/status", authMiddleware, requireAdmin, updateOrderStatus);



export default router;