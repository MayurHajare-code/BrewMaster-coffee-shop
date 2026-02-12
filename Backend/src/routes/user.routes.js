import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { register, login, logout, getMe, updateMe } from '../controllers/auth.controller.js';

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authMiddleware, getMe);
router.put("/me/:id", authMiddleware, updateMe);

export default router;



