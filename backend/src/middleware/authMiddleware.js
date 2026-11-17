
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authentication required."
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "pathway-local-dev-jwt-secret"
        );

        const [rows] = await pool.execute(
            `SELECT id, role, is_active
             FROM users
             WHERE id = ?`,
            [decoded.sub]
        );

        if (
            rows.length === 0 ||
            !rows[0].is_active ||
            rows[0].role !== decoded.role
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid or inactive account."
            });
        }

        req.user = {
            id: rows[0].id,
            role: rows[0].role
        };

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token."
        });
    }
};

// Role-based authorization
export const authorize = (...allowedRoles) => {
    return (req, res, next) => {

        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission."
            });
        }

        next();
    };
};