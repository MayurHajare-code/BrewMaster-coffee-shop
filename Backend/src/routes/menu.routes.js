import express from 'express';
import { getMenu, createMenu, updateCategory, deleteCategory, getMenuById } from '../controllers/menu.controller.js';
// import { imgUpload } from '../middlewares/imgUpload.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { requireAdmin } from '../middlewares/AdminOnly.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

router.get("/", getMenu);
router.get("/:id", getMenuById);

// admin only route
router.post(
    "/",
    authMiddleware,
    requireAdmin,
    // imgUpload.single("image"),
    upload.single("image"),
    createMenu
);

router.put(
    "/:id",
    authMiddleware,
    requireAdmin,
    upload.single("image"),
    updateCategory
);

router.delete(
    "/:id",
    authMiddleware,
    requireAdmin,
    deleteCategory
);


export default router;