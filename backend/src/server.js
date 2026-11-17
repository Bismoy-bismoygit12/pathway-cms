import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import pool, { verifyOrFallbackPool } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const allowedOrigins = [
    process.env.CLIENT_URL,
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173"
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
            return callback(null, true);
        }
        return callback(null, true);
    },
    credentials: true
}));

app.use(express.json({ limit: "5mb" }));

// Mounted APIs
app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/users", userRoutes);

// Backend health check
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Pathway Backend is running!",
        status: "Online"
    });
});

// Database health check
app.get("/api/db-health", async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT DATABASE() AS database_name, NOW() AS server_time"
        );

        res.json({
            success: true,
            database: rows[0].database_name,
            serverTime: rows[0].server_time
        });
    } catch (error) {
        console.error("Database Error:", error.message);
        res.status(500).json({
            success: false,
            message: "Database connection failed."
        });
    }
});

// Serve built frontend static files
const frontendDistPath = path.resolve(__dirname, "../../frontend/dist");
if (fs.existsSync(frontendDistPath)) {
    app.use(express.static(frontendDistPath));
    app.get("/{*splat}", (req, res, next) => {
        if (req.path.startsWith("/api")) {
            return next();
        }
        res.sendFile(path.join(frontendDistPath, "index.html"));
    });
} else {
    app.get("/", (req, res) => {
        res.json({
            success: true,
            name: "Pathway Healthcare API",
            status: "Online",
            version: "1.0.0"
        });
    });
}

const PORT = Number(process.env.PORT) || 3000;
const HOST = "0.0.0.0";

async function startServer() {
    const connected = await verifyOrFallbackPool();
    if (connected) {
        console.log("MySQL Database connected successfully!");
    } else {
        console.log("Running with in-memory mock database.");
    }

    app.listen(PORT, HOST, () => {
        console.log(`Pathway server running on http://${HOST}:${PORT}`);
    });
}

startServer();
