import pool from "../config/db.js";

// GET /api/payments/my - Get user payment history
export const getMyPayments = async (req, res) => {
    try {
        const userId = req.user.id;

        const [rows] = await pool.execute(
            `SELECT p.id, p.appointment_id, p.amount, p.currency, p.payment_method,
                    p.transaction_reference, p.status, p.paid_at, p.created_at,
                    du.full_name AS doctorName
             FROM payments p
             JOIN appointments a ON p.appointment_id = a.id
             JOIN doctor_profiles dp ON a.doctor_id = dp.id
             JOIN users du ON dp.user_id = du.id
             WHERE a.patient_id = ?
             ORDER BY p.created_at DESC`,
            [userId]
        );

        const payments = rows.map((p) => ({
            id: `pay-${p.id}`,
            userId: String(userId),
            type: "consultation",
            title: `Consultation with ${p.doctorName}`,
            titleBn: `${p.doctorName} এর অনলাইন ভিজিট ফি`,
            amountBDT: Number(p.amount),
            method: p.payment_method,
            status: p.status === "paid" ? "completed" : p.status,
            date: new Date(p.created_at).toISOString().split("T")[0],
            referenceId: p.transaction_reference || `TXN-${p.id}`
        }));

        return res.json({
            success: true,
            payments
        });
    } catch (error) {
        console.error("Get Payments Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve payments history."
        });
    }
};

// POST /api/payments - Submit payment for an appointment
export const recordPayment = async (req, res) => {
    try {
        const userId = req.user.id;
        const { appointmentId, amount, paymentMethod, transactionReference } = req.body;
        const rawAptId = String(appointmentId).replace("apt-", "");

        if (!rawAptId || !amount || !paymentMethod) {
            return res.status(400).json({
                success: false,
                message: "Appointment ID, amount, and payment method are required."
            });
        }

        const txnRef = transactionReference || `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

        const [result] = await pool.execute(
            `INSERT INTO payments
             (appointment_id, amount, currency, payment_method, transaction_reference, status, paid_at)
             VALUES (?, ?, 'BDT', ?, ?, 'paid', NOW())
             ON DUPLICATE KEY UPDATE status = 'paid', paid_at = NOW()`,
            [rawAptId, Number(amount), paymentMethod, txnRef]
        );

        return res.status(201).json({
            success: true,
            message: "Payment recorded successfully.",
            paymentId: result.insertId,
            referenceId: txnRef
        });
    } catch (error) {
        console.error("Record Payment Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to record payment."
        });
    }
};
