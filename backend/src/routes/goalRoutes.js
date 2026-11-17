import express from "express";
import {
    getDailyGoals,
    completeGoal,
    getGoalTemplates
} from "../controllers/goalController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/templates", getGoalTemplates);
router.use(protect);
router.get("/", getDailyGoals);
router.post("/complete", completeGoal);

export default router;
