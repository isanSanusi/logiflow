import { Router } from "express";
import { protect, authorize } from "../middlewares/authMiddleware.js";
import {
  createCompany,
  getAllCompanies,
  updateCompany,
  deleteCompany,
} from "../controllers/devController.js";

const router = Router();

// Developer only
router.use(protect, authorize("developer"));
router.get("/", protect, getAllCompanies);
router.post("/", protect, createCompany);
router.put("/:id", protect, updateCompany);
router.delete("/:id", protect, deleteCompany);

export default router;
