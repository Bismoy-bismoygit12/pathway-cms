
import express from "express";

import {
    registerPatient,
    registerDoctor,
    loginUser,
    getCurrentUser
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register/patient", registerPatient);
router.post("/register/doctor", registerDoctor);
router.post("/login", loginUser);

// Protected route
router.get("/me", protect, getCurrentUser);

export default router;