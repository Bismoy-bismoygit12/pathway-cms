import pool from "../config/db.js";

// Helper to format ISO datetime to readable date and time
function formatDateTime(dt) {
    const d = new Date(dt);
    const dateStr = d.toISOString().split("T")[0];
    let hours = d.getHours();
    const minutes = d.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const timeStr = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${ampm}`;
    return { date: dateStr, time: timeStr };
}

// POST /api/appointments - Book a visit
export const createAppointment = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const patientId = req.user.id;
        const {
            doctorId,
            date,
            time,
            mode = "online",
            concerns = "",
            consentToShareData = 1,
            paymentMethod = "bkash",
            feeBDT = 1500
        } = req.body;

        if (!doctorId || !date || !time) {
            return res.status(400).json({
                success: false,
                message: "Doctor, date, and time are required to book an appointment."
            });
        }

        // Verify doctor profile exists
        const [docRows] = await connection.execute(
            `SELECT dp.id, u.full_name, dp.consultation_fee
             FROM doctor_profiles dp
             JOIN users u ON dp.user_id = u.id
             WHERE dp.id = ?`,
            [doctorId]
        );

        if (docRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Selected doctor profile does not exist."
            });
        }

        // Build scheduled_at timestamp
        // Parse time string e.g. "04:30 PM"
        let [timePart, modifier] = time.split(" ");
        let [hours, minutes] = timePart.split(":");
        let h = parseInt(hours, 10);
        if (modifier === "PM" && h < 12) h += 12;
        if (modifier === "AM" && h === 12) h = 0;
        const scheduledAt = `${date} ${String(h).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`;

        await connection.beginTransaction();

        // Prevent double booking for doctor at that datetime
        const [existing] = await connection.execute(
            `SELECT id FROM appointments 
             WHERE doctor_id = ? AND scheduled_at = ? AND status IN ('pending', 'confirmed')`,
            [doctorId, scheduledAt]
        );

        if (existing.length > 0) {
            await connection.rollback();
            return res.status(409).json({
                success: false,
                message: "This appointment slot has already been booked. Please choose another time."
            });
        }

        // Insert appointment
        const [aptResult] = await connection.execute(
            `INSERT INTO appointments
             (patient_id, doctor_id, scheduled_at, duration_minutes, consultation_mode, concerns, consent_to_share_data, status)
             VALUES (?, ?, ?, 30, ?, ?, ?, 'confirmed')`,
            [
                patientId,
                doctorId,
                scheduledAt,
                mode === "in_person" ? "in_person" : "online",
                concerns,
                consentToShareData ? 1 : 0
            ]
        );

        const appointmentId = aptResult.insertId;
        const finalFee = Number(feeBDT) || Number(docRows[0].consultation_fee) || 1500;
        const txnRef = `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

        // Insert payment record
        await connection.execute(
            `INSERT INTO payments
             (appointment_id, amount, currency, payment_method, transaction_reference, status, paid_at)
             VALUES (?, ?, 'BDT', ?, ?, 'paid', NOW())`,
            [
                appointmentId,
                finalFee,
                paymentMethod,
                txnRef
            ]
        );

        // Insert notification
        await connection.execute(
            `INSERT INTO notifications
             (user_id, title, message, notification_type, is_read)
             VALUES (?, 'Appointment Confirmed', ?, 'visits', 0)`,
            [
                patientId,
                `Your appointment with ${docRows[0].full_name} is confirmed for ${date} at ${time}.`
            ]
        );

        await connection.commit();

        return res.status(201).json({
            success: true,
            message: "Appointment booked successfully.",
            appointment: {
                id: `apt-${appointmentId}`,
                userId: String(patientId),
                doctorId: String(doctorId),
                doctorName: docRows[0].full_name,
                doctorNameBn: docRows[0].full_name,
                doctorTitle: 'Consultant Psychiatrist',
                doctorHospital: 'National Institute of Mental Health',
                doctorPhoto: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=300&fit=crop&crop=face',
                date,
                time,
                mode,
                status: 'confirmed',
                feeBDT: finalFee,
                paymentMethod,
                paymentStatus: 'paid',
                reason: concerns,
                concernsList: concerns ? [concerns] : [],
                sharedData: {
                    profile: true,
                    goals: true,
                    moods: true,
                    healthBasics: false,
                    reports: true
                },
                createdAt: new Date().toISOString()
            }
        });
    } catch (error) {
        await connection.rollback();
        console.error("Create Appointment Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to book appointment."
        });
    } finally {
        connection.release();
    }
};

// GET /api/appointments/my - Get user appointments
export const getMyAppointments = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;

        let query = "";
        let params = [];

        if (userRole === "doctor") {
            query = `
                SELECT 
                    a.id,
                    a.patient_id,
                    a.doctor_id,
                    a.scheduled_at,
                    a.duration_minutes,
                    a.consultation_mode,
                    a.concerns,
                    a.status,
                    a.created_at,
                    pu.full_name AS patientName,
                    pu.email AS patientEmail,
                    pu.phone AS patientPhone,
                    du.full_name AS doctorName,
                    du.profile_image AS doctorPhoto,
                    p.amount AS feeBDT,
                    p.payment_method,
                    p.status AS paymentStatus
                FROM appointments a
                JOIN doctor_profiles dp ON a.doctor_id = dp.id
                JOIN users du ON dp.user_id = du.id
                JOIN users pu ON a.patient_id = pu.id
                LEFT JOIN payments p ON a.id = p.appointment_id
                WHERE dp.user_id = ?
                ORDER BY a.scheduled_at DESC
            `;
            params = [userId];
        } else {
            query = `
                SELECT 
                    a.id,
                    a.patient_id,
                    a.doctor_id,
                    a.scheduled_at,
                    a.duration_minutes,
                    a.consultation_mode,
                    a.concerns,
                    a.status,
                    a.created_at,
                    du.full_name AS doctorName,
                    du.profile_image AS doctorPhoto,
                    p.amount AS feeBDT,
                    p.payment_method,
                    p.status AS paymentStatus
                FROM appointments a
                JOIN doctor_profiles dp ON a.doctor_id = dp.id
                JOIN users du ON dp.user_id = du.id
                LEFT JOIN payments p ON a.id = p.appointment_id
                WHERE a.patient_id = ?
                ORDER BY a.scheduled_at DESC
            `;
            params = [userId];
        }

        const [rows] = await pool.execute(query, params);

        const appointments = rows.map((r) => {
            const dt = formatDateTime(r.scheduled_at);
            return {
                id: `apt-${r.id}`,
                numericId: r.id,
                userId: String(r.patient_id),
                doctorId: String(r.doctor_id),
                doctorName: r.doctorName,
                doctorNameBn: r.doctorName,
                doctorTitle: 'Consultant Psychiatrist',
                doctorHospital: 'National Institute of Mental Health',
                doctorPhoto: r.doctorPhoto || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=300&fit=crop&crop=face',
                date: dt.date,
                time: dt.time,
                mode: r.consultation_mode,
                status: r.status,
                feeBDT: Number(r.feeBDT) || 1500,
                paymentMethod: r.payment_method || 'bkash',
                paymentStatus: r.paymentStatus || 'paid',
                reason: r.concerns || 'Consultation session',
                concernsList: r.concerns ? [r.concerns] : [],
                sharedData: {
                    profile: true,
                    goals: true,
                    moods: true,
                    healthBasics: false,
                    reports: true
                },
                createdAt: r.created_at
            };
        });

        return res.json({
            success: true,
            appointments
        });
    } catch (error) {
        console.error("Get My Appointments Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve appointments."
        });
    }
};

// PATCH /api/appointments/:id/status - Cancel or update appointment status
export const updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const rawId = String(id).replace("apt-", "");

        if (!['pending', 'confirmed', 'cancelled', 'completed', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid appointment status."
            });
        }

        const [result] = await pool.execute(
            `UPDATE appointments 
             SET status = ? 
             WHERE id = ? AND (patient_id = ? OR doctor_id IN (SELECT id FROM doctor_profiles WHERE user_id = ?))`,
            [status, rawId, req.user.id, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found or unauthorized."
            });
        }

        return res.json({
            success: true,
            message: `Appointment status updated to ${status}.`
        });
    } catch (error) {
        console.error("Update Appointment Status Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update appointment status."
        });
    }
};
