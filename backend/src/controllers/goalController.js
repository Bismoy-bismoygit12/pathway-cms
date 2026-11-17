import pool from "../config/db.js";

// GET /api/goals - Get user's daily goals for today
export const getDailyGoals = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const userId = req.user.id;
        const todayStr = new Date().toISOString().split("T")[0];

        // Check if user has goals assigned for today
        const [existing] = await connection.execute(
            `SELECT ug.id AS userGoalId, ug.is_completed, ug.completed_at,
                    gt.id AS templateId, gt.title, gt.description, gt.points
             FROM user_goals ug
             JOIN goal_templates gt ON ug.goal_template_id = gt.id
             WHERE ug.user_id = ? AND ug.assigned_date = ?`,
            [userId, todayStr]
        );

        let goalsList = existing;

        // If no goals assigned today, auto-assign from available active templates
        if (existing.length === 0) {
            const [templates] = await connection.execute(
                `SELECT id, title, description, points 
                 FROM goal_templates 
                 WHERE is_active = TRUE 
                 LIMIT 4`
            );

            if (templates.length > 0) {
                for (const t of templates) {
                    await connection.execute(
                        `INSERT IGNORE INTO user_goals (user_id, goal_template_id, assigned_date, is_completed)
                         VALUES (?, ?, ?, 0)`,
                        [userId, t.id, todayStr]
                    );
                }

                const [fresh] = await connection.execute(
                    `SELECT ug.id AS userGoalId, ug.is_completed, ug.completed_at,
                            gt.id AS templateId, gt.title, gt.description, gt.points
                     FROM user_goals ug
                     JOIN goal_templates gt ON ug.goal_template_id = gt.id
                     WHERE ug.user_id = ? AND ug.assigned_date = ?`,
                    [userId, todayStr]
                );
                goalsList = fresh;
            }
        }

        // Calculate total points earned by user
        const [pointsRow] = await connection.execute(
            `SELECT COALESCE(SUM(gt.points), 0) AS totalPoints
             FROM user_goals ug
             JOIN goal_templates gt ON ug.goal_template_id = gt.id
             WHERE ug.user_id = ? AND ug.is_completed = 1`,
            [userId]
        );

        // Format to match frontend Goal interface
        const formattedGoals = goalsList.map((g) => ({
            id: `g-${g.templateId}`,
            userGoalId: g.userGoalId,
            title: g.title,
            titleBn: g.title,
            category: g.title.toLowerCase().includes("breath")
                ? "breathing"
                : g.title.toLowerCase().includes("water")
                ? "hydration"
                : "walk",
            durationMinutes: 4,
            minDurationSeconds: 15,
            pointsReward: Number(g.points) || 20,
            source: "suggested",
            completed: Boolean(g.is_completed),
            completedAt: g.completed_at,
            description: g.description,
            descriptionBn: g.description,
            steps: [
                { text: "Take a quiet moment for yourself.", textBn: "নিজের জন্য একটি শান্ত মুহূর্ত নিন।" },
                { text: "Follow the gentle cadence comfortably.", textBn: "স্বাচ্ছন্দ্যে অনুশীলনটি অনুসরণ করুন।" },
                { text: "Acknowledge your progress today.", textBn: "আজকের অগ্রগতির জন্য নিজেকে ধন্যবাদ জানান।" }
            ]
        }));

        return res.json({
            success: true,
            date: todayStr,
            totalPoints: Number(pointsRow[0].totalPoints) || 0,
            goals: formattedGoals
        });
    } catch (error) {
        console.error("Get Daily Goals Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve daily goals."
        });
    } finally {
        connection.release();
    }
};

// POST /api/goals/complete - Complete a goal
export const completeGoal = async (req, res) => {
    try {
        const userId = req.user.id;
        const { goalId } = req.body; // e.g. "g-1" or "1"
        const templateId = String(goalId).replace("g-", "");
        const todayStr = new Date().toISOString().split("T")[0];

        // Fetch template to know points
        const [templateRows] = await pool.execute(
            `SELECT id, title, points FROM goal_templates WHERE id = ?`,
            [templateId]
        );

        const pointsEarned = templateRows.length > 0 ? Number(templateRows[0].points) : 25;

        // Ensure user_goals record exists and mark complete
        await pool.execute(
            `INSERT INTO user_goals (user_id, goal_template_id, assigned_date, is_completed, completed_at)
             VALUES (?, ?, ?, 1, NOW())
             ON DUPLICATE KEY UPDATE is_completed = 1, completed_at = NOW()`,
            [userId, templateId, todayStr]
        );

        return res.json({
            success: true,
            message: "Goal marked as complete!",
            pointsEarned
        });
    } catch (error) {
        console.error("Complete Goal Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to mark goal as complete."
        });
    }
};

// GET /api/goals/templates - Get all available goal templates
export const getGoalTemplates = async (req, res) => {
    try {
        const [rows] = await pool.execute(
            `SELECT id, title, description, points, is_active FROM goal_templates WHERE is_active = TRUE`
        );
        return res.json({
            success: true,
            templates: rows
        });
    } catch (error) {
        console.error("Get Goal Templates Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve goal templates."
        });
    }
};
