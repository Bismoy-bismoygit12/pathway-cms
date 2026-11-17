
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

const JWT_SECRET = process.env.JWT_SECRET || "pathway-local-dev-jwt-secret";

const createToken = (user) => {
    return jwt.sign(
        {
            sub: user.id,
            role: user.role
        },
        JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "1d"
        }
    );
};

// PATIENT REGISTRATION
export const registerPatient = async (req, res) => {
    try {
        const { full_name, email, phone, password } = req.body;

        if (!full_name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required."
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email address."
            });
        }

        if (typeof password !== "string" || password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters."
            });
        }

        const [existing] = await pool.execute(
            "SELECT id FROM users WHERE email = ?",
            [normalizedEmail]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email already registered."
            });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const [result] = await pool.execute(
            `INSERT INTO users
            (full_name, email, phone, password_hash, role)
            VALUES (?, ?, ?, ?, 'patient')`,
            [
                full_name.trim(),
                normalizedEmail,
                phone?.trim() || null,
                passwordHash
            ]
        );

        const user = {
            id: result.insertId,
            full_name: full_name.trim(),
            email: normalizedEmail,
            role: "patient"
        };

        const token = createToken(user);

        return res.status(201).json({
            success: true,
            message: "Patient account created successfully.",
            token,
            user
        });

    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message: "Email or phone number already exists."
            });
        }

        console.error("Patient Registration Error:", error);

        return res.status(500).json({
            success: false,
            message: "Registration failed."
        });
    }
};

// DOCTOR REGISTRATION
export const registerDoctor = async (req, res) => {
    const connection = await pool.getConnection();


    try {
        const {
            full_name,
            email,
            phone,
            password,
            license_number,
            bio,
            experience_years,
            consultation_fee
        } = req.body;

        if (
            !full_name ||
            !email ||
            !password ||
            !license_number
        ) {
            return res.status(400).json({
                success: false,
                message: "Name, email, password and license number are required."
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email address."
            });
        }

        if (typeof password !== "string" || password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters."
            });
        }

        if (
            !Number.isInteger(experience_years ?? 0) ||
            (experience_years ?? 0) < 0 ||
            !Number.isFinite(Number(consultation_fee ?? 0)) ||
            Number(consultation_fee ?? 0) < 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid doctor profile information."
            });
        }

        const [existing] = await connection.execute(
            `SELECT id FROM users WHERE email = ?
             UNION
             SELECT user_id AS id FROM doctor_profiles
             WHERE license_number = ?`,
            [normalizedEmail, license_number.trim()]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email or license number already registered."
            });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        await connection.beginTransaction();

        const [userResult] = await connection.execute(
            `INSERT INTO users
            (full_name, email, phone, password_hash, role)
            VALUES (?, ?, ?, ?, 'doctor')`,
            [
                full_name.trim(),
                normalizedEmail,
                phone?.trim() || null,
                passwordHash
            ]
        );

        await connection.execute(
            `INSERT INTO doctor_profiles
            (user_id, license_number, bio, experience_years,
             consultation_fee, approval_status)
            VALUES (?, ?, ?, ?, ?, 'pending')`,
            [
                userResult.insertId,
                license_number.trim(),
                bio?.trim() || null,
                experience_years ?? 0,
                consultation_fee ?? 0
            ]
        );

        await connection.commit();

        const user = {
            id: userResult.insertId,
            full_name: full_name.trim(),
            email: normalizedEmail,
            role: "doctor",
            approval_status: "pending"
        };

        const token = createToken(user);

        return res.status(201).json({
            success: true,
            message: "Doctor registration submitted for approval.",
            token,
            user
        });

    } catch (error) {
        await connection.rollback();

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message: "Email, phone or license number already exists."
            });
        }

        console.error("Doctor Registration Error:", error);

        return res.status(500).json({
            success: false,
            message: "Doctor registration failed."
        });

    } finally {
        connection.release();
    }
};

// LOGIN
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const [rows] = await pool.execute(
            `SELECT
                id,
                full_name,
                email,
                password_hash,
                role,
                is_active
             FROM users
             WHERE email = ?
             LIMIT 1`,
            [normalizedEmail]
        );

        if (rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        const user = rows[0];

        const passwordMatch = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        if (!user.is_active) {
            return res.status(403).json({
                success: false,
                message: "Your account is inactive."
            });
        }

        let approvalStatus = null;

        if (user.role === "doctor") {
            const [doctorRows] = await pool.execute(
                `SELECT approval_status
                 FROM doctor_profiles
                 WHERE user_id = ?`,
                [user.id]
            );

            if (doctorRows.length === 0) {
                return res.status(403).json({
                    success: false,
                    message: "Doctor profile not found."
                });
            }

            approvalStatus = doctorRows[0].approval_status;

            if (approvalStatus !== "approved") {
                return res.status(403).json({
                    success: false,
                    message: "Your doctor account is awaiting approval."
                });
            }
        }

        const token = createToken(user);

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            token,
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                role: user.role,
                approval_status: approvalStatus
            }
        });

    } catch (error) {
        console.error("Login Error:", error);

        return res.status(500).json({
            success: false,
            message: "Login failed."
        });
    }
};

// CURRENT USER
export const getCurrentUser = async (req, res) => {
    try {
        const [rows] = await pool.execute(
            `SELECT
                id, full_name, email, phone,
                role, profile_image, created_at
             FROM users
             WHERE id = ? AND is_active = TRUE`,
            [req.user.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        return res.status(200).json({
            success: true,
            user: rows[0]
        });

    } catch (error) {
        console.error("Current User Error:", error);

        return res.status(500).json({
            success: false,
            message: "Could not retrieve user."
        });
    }
};