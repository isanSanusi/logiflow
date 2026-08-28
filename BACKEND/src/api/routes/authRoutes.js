import { login, refresh, logout, me } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { Router } from "express";

const router = Router();
router.post("/login", login);
router.get("/me", protect, me);
router.post("/refresh", refresh);
router.post("/logout", protect, logout);

export default router;
