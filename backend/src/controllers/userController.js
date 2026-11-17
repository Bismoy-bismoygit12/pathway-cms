import bcrypt from "bcryptjs";
import pool from "../config/db.js";

// PATCH /api/users/profile - Update personal profile
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { full_name, phone, profile_image } = req.body;

        const updates = [];
        const params = [];

        if (full_name !== undefined) {
            updates.push("full_name = ?");
            params.push(full_name.trim());
        }

        if (phone !== undefined) {
            updates.push("phone = ?");
            params.push(phone ? phone.trim() : null);
        }

        if (profile_image !== undefined) {
            updates.push("profile_image = ?");
            params.push(profile_image);
        }

        if (updates.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No fields provided to update."
            });
        }

        params.push(userId);

        await pool.execute(
            `UPDATE users SET ${updates.join(", ")} WHERE id = ?`,
            params
        );

        const [rows] = await pool.execute(
            `SELECT id, full_name, email, phone, role, profile_image, created_at FROM users WHERE id = ?`,
            [userId]
        );

        return res.json({
            success: true,
            message: "Profile updated successfully.",
            user: rows[0]
        });
    } catch (error) {
        console.error("Update Profile Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update profile."
        });
    }
};

// PATCH /api/users/password - Change user password
export const changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Current password and new password are required."
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 8 characters long."
            });
        }

        const [rows] = await pool.execute(
            `SELECT password_hash FROM users WHERE id = ?`,
            [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const match = await bcrypt.compare(currentPassword, rows[0].password_hash);
        if (!match) {
            return res.status(401).json({
                success: false,
                message: "Current password does not match."
            });
        }

        const newHash = await bcrypt.hash(newPassword, 12);

        await pool.execute(
            `UPDATE users SET password_hash = ? WHERE id = ?`,
            [newHash, userId]
        );

        return res.json({
            success: true,
            message: "Password changed successfully."
        });
    } catch (error) {
        console.error("Change Password Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to change password."
        });
    }
};
