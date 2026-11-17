import express from "express";
import {
    createAppointment,
    getMyAppointments,
    updateAppointmentStatus
} from "../controllers/appointmentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/", createAppointment);
router.get("/my", getMyAppointments);
router.patch("/:id/status", updateAppointmentStatus);

export default router;
