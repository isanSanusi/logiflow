import { Router } from "express";
import { protect, authorize } from "../middlewares/authMiddleware.js";
import {
  getAllUsers,
  createUsers,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const router = Router();

router.use(protect, authorize("ADMIN"));
router.get("/", getAllUsers);
router.post("/", protect, createUsers);
router.put("/:id", protect, updateUser);
router.delete("/:id", protect, deleteUser);

export default router;
