import express from "express";
import { protect, authorize } from "../middlewares/authMiddleware.js";
import {
  createData,
  getDatas,
  getDataById,
  updateData,
  markedData,
  deleteData,
} from "../controllers/productController.js";

const router = express.Router();

// router.use(protect, authorize("USER",));
router.get("/", getDatas);
router.post("/", createData);
router.put("/:id", updateData);
router.get("/:id", getDataById);
router.delete("/:id", deleteData);
router.post("/mark/:id", markedData);

export default router;
