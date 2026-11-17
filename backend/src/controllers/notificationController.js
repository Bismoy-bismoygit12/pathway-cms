import pool from "../config/db.js";

// GET /api/notifications - Get user notifications
export const getMyNotifications = async (req, res) => {
    try {
        const userId = req.user.id;

        const [rows] = await pool.execute(
            `SELECT id, user_id, title, message, notification_type, is_read, created_at
             FROM notifications
             WHERE user_id = ?
             ORDER BY created_at DESC
             LIMIT 50`,
            [userId]
        );

        const notifications = rows.map((n) => ({
            id: `notif-${n.id}`,
            category: n.notification_type || "motivation",
            title: n.title,
            titleBn: n.title,
            body: n.message,
            bodyBn: n.message,
            createdAt: n.created_at,
            read: Boolean(n.is_read)
        }));

        const unreadCount = notifications.filter((n) => !n.read).length;

        return res.json({
            success: true,
            unreadCount,
            notifications
        });
    } catch (error) {
        console.error("Get Notifications Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve notifications."
        });
    }
};

// PATCH /api/notifications/:id/read - Mark single notification as read
export const markNotificationRead = async (req, res) => {
    try {
        const userId = req.user.id;
        const rawId = String(req.params.id).replace("notif-", "");

        await pool.execute(
            `UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?`,
            [rawId, userId]
        );

        return res.json({
            success: true,
            message: "Notification marked as read."
        });
    } catch (error) {
        console.error("Mark Read Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update notification."
        });
    }
};

// PATCH /api/notifications/read-all - Mark all as read
export const markAllNotificationsRead = async (req, res) => {
    try {
        const userId = req.user.id;

        await pool.execute(
            `UPDATE notifications SET is_read = 1 WHERE user_id = ?`,
            [userId]
        );

        return res.json({
            success: true,
            message: "All notifications marked as read."
        });
    } catch (error) {
        console.error("Mark All Read Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update notifications."
        });
    }
};
