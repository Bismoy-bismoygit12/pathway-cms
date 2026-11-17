import pool from "../config/db.js";

// GET /api/reports - Get user's medical reports
export const getMyReports = async (req, res) => {
    try {
        const userId = req.user.id;

        const [rows] = await pool.execute(
            `SELECT id, user_id, report_title, report_type, file_name, storage_path, uploaded_at
             FROM medical_reports
             WHERE user_id = ?
             ORDER BY uploaded_at DESC`,
            [userId]
        );

        const reports = rows.map((r) => ({
            id: `rep-${r.id}`,
            numericId: r.id,
            userId: String(r.user_id),
            title: r.report_title,
            reportType: r.report_type || "Lab Investigation",
            fileName: r.file_name,
            fileSize: "1.2 MB",
            uploadedAt: new Date(r.uploaded_at).toISOString().split("T")[0],
            extractedValues: [
                {
                    label: "Metabolic Stability",
                    labelBn: "মেটাবলিক স্থিতি",
                    value: "Normal Range",
                    referenceRange: "Optimal",
                    status: "normal",
                    explanation: "Routine biomarker within reference ranges.",
                    explanationBn: "বায়োমার্কার স্বাভাবিক সীমার মধ্যে রয়েছে।"
                }
            ],
            lifestyleTips: ["Stay well hydrated", "Maintain consistent sleep cycle"],
            lifestyleTipsBn: ["পর্যাপ্ত পানি পান করুন", "নিয়মিত ঘুমানোর অভ্যাস রাখুন"],
            doctorTypeToSee: "Consultant Psychiatrist",
            doctorTypeToSeeBn: "সাইকিয়াট্রিস্ট",
            sharedWithDoctorIds: []
        }));

        return res.json({
            success: true,
            reports
        });
    } catch (error) {
        console.error("Get Reports Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve medical reports."
        });
    }
};

// POST /api/reports - Add report
export const createReport = async (req, res) => {
    try {
        const userId = req.user.id;
        const { title, reportType = "General Report", fileName } = req.body;

        if (!title || !fileName) {
            return res.status(400).json({
                success: false,
                message: "Title and file name are required."
            });
        }

        const storagePath = `uploads/${userId}/${Date.now()}_${fileName}`;

        const [result] = await pool.execute(
            `INSERT INTO medical_reports
             (user_id, report_title, report_type, file_name, storage_path)
             VALUES (?, ?, ?, ?, ?)`,
            [userId, title.trim(), reportType, fileName.trim(), storagePath]
        );

        return res.status(201).json({
            success: true,
            message: "Report uploaded successfully.",
            report: {
                id: `rep-${result.insertId}`,
                userId: String(userId),
                title: title.trim(),
                reportType,
                fileName: fileName.trim(),
                fileSize: "1.2 MB",
                uploadedAt: new Date().toISOString().split("T")[0],
                extractedValues: [],
                lifestyleTips: [],
                lifestyleTipsBn: [],
                doctorTypeToSee: "Consultant Psychiatrist",
                doctorTypeToSeeBn: "সাইকিয়াট্রিস্ট",
                sharedWithDoctorIds: []
            }
        });
    } catch (error) {
        console.error("Create Report Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to save report."
        });
    }
};

// DELETE /api/reports/:id - Delete report
export const deleteReport = async (req, res) => {
    try {
        const userId = req.user.id;
        const rawId = String(req.params.id).replace("rep-", "");

        const [result] = await pool.execute(
            `DELETE FROM medical_reports WHERE id = ? AND user_id = ?`,
            [rawId, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Report not found or unauthorized."
            });
        }

        return res.json({
            success: true,
            message: "Report removed successfully."
        });
    } catch (error) {
        console.error("Delete Report Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete report."
        });
    }
};
