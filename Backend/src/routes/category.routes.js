import express from 'express';
import { getCategory, createCategory, updateCategory, deleteCategory } from '../controllers/category.controller.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { requireAdmin } from '../middlewares/AdminOnly.js';

const router = express.Router();

router.get("/", getCategory);

// admin only route
router.post("/",
    authMiddleware,
    requireAdmin,
    createCategory);

router.put("/:id",
    authMiddleware,
    requireAdmin,
    updateCategory);

router.delete("/:id",
    authMiddleware,
    requireAdmin,
    deleteCategory);

export default router;