import express from "express";
import { getMyPayments, recordPayment } from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.get("/my", getMyPayments);
router.post("/", recordPayment);

export default router;
