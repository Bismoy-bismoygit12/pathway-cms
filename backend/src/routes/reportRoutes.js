import express from "express";
import {
    getMyReports,
    createReport,
    deleteReport
} from "../controllers/reportController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.get("/", getMyReports);
router.post("/", createReport);
router.delete("/:id", deleteReport);

export default router;
