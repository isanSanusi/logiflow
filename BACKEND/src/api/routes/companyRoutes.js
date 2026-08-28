import { Router } from "express";
import { protect, authorize } from "../middlewares/authMiddleware.js";
import {
  getAllUsers,
  createUsers,
  updateUser,
  deleteUser,
} from "../controllers/companyController.js";

const router = Router();

router.use(protect, authorize("SUPER_ADMIN"));
router.get("/", protect, getAllUsers);
router.post("/", protect, createUsers);
router.put("/:id", protect, updateUser);
router.delete("/:id", protect, deleteUser);

export default router;
