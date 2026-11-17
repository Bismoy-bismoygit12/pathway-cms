import bcrypt from "bcryptjs";
import pool from "./db.js";

export async function seedDatabase() {
    const connection = await pool.getConnection();
    try {
        console.log("Starting database seed...");
        await connection.beginTransaction();

        // 1. Seed Specialties
        const specialties = [
            { name: "Substance & Alcohol Recovery", description: "Comprehensive evidence-based recovery care and stabilization." },
            { name: "Sleep & Insomnia", description: "Restorative sleep techniques and circadian regulation." },
            { name: "Depression & Mood Care", description: "Gentle evidence-backed mood care and coping support." },
            { name: "Anxiety & Panic", description: "Cognitive calming strategies for anxiety and panic reduction." },
            { name: "Relapse Prevention", description: "Trigger identification, craving surfing, and long-term sobriety." },
            { name: "Women's Recovery Support", description: "Specialized, empathetic care for women navigating dependence." },
            { name: "Family & Caregiver Support", description: "Family boundary guidance and healing communication." }
        ];

        for (const s of specialties) {
            await connection.execute(
                `INSERT INTO specialties (name, description) VALUES (?, ?)
                 ON DUPLICATE KEY UPDATE description = VALUES(description)`,
                [s.name, s.description]
            );
        }

        // 2. Seed Goal Templates
        const goalTemplates = [
            { title: "Box Breathing for Inner Peace", description: "Slow 4-second box breathing to calm the nervous system.", points: 25 },
            { title: "Cool Water Reset", description: "Drink a full tall glass of clean water slowly to replenish hydration.", points: 15 },
            { title: "10-Minute Mindful Fresh Air Walk", description: "Gentle stroll noticing colors, sensations, and peaceful natural rhythm.", points: 20 },
            { title: "Evening Gratitude & Safe Reflection", description: "Note one kind thing you did for yourself or someone else today.", points: 15 },
            { title: "15-Minute Urge Surfing Practice", description: "Ride cravings like ocean waves without judgment until they dissipate.", points: 30 }
        ];

        for (const gt of goalTemplates) {
            await connection.execute(
                `INSERT INTO goal_templates (title, description, points, is_active) VALUES (?, ?, ?, 1)
                 ON DUPLICATE KEY UPDATE description = VALUES(description), points = VALUES(points)`,
                [gt.title, gt.description, gt.points]
            );
        }

        // Common password hash for test accounts: "Password123"
        const defaultHash = await bcrypt.hash("Password123", 12);

        // 3. Seed Patient Users
        const [patientResult] = await connection.execute(
            `INSERT INTO users (full_name, email, phone, password_hash, role, profile_image, is_active)
             VALUES (?, ?, ?, ?, 'patient', ?, 1)
             ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), password_hash = VALUES(password_hash)`,
            [
                "Shanto Chowdhury",
                "shanto@example.com",
                "01711223344",
                defaultHash,
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face"
            ]
        );

        await connection.execute(
            `INSERT INTO users (full_name, email, phone, password_hash, role, profile_image, is_active)
             VALUES (?, ?, ?, ?, 'patient', ?, 1)
             ON DUPLICATE KEY UPDATE full_name = VALUES(full_name)`,
            [
                "Nabila Rahman",
                "nabila@example.com",
                "01812345678",
                defaultHash,
                "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face"
            ]
        );

        // Get patient Shanto's ID
        const [shantoRows] = await connection.execute(`SELECT id FROM users WHERE email = 'shanto@example.com'`);
        const shantoId = shantoRows[0].id;

        // 4. Seed Doctors
        const doctorsData = [
            {
                name: "Prof. Dr. Tanvir Ahmed",
                email: "dr.tanvir@example.com",
                phone: "01719998811",
                license: "BMDC-A-48912",
                fee: 2000.00,
                experience: 18,
                bio: "Over 18 years helping individuals and families navigate substance dependence with deep empathy, evidence-backed medical guidance, and practical coping plans.",
                photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=300&fit=crop&crop=face",
                specialties: ["Substance & Alcohol Recovery", "Depression & Mood Care", "Relapse Prevention"]
            },
            {
                name: "Dr. Nusrat Jahan",
                email: "dr.nusrat@example.com",
                phone: "01819998822",
                license: "BMDC-A-59123",
                fee: 1800.00,
                experience: 14,
                bio: "Gentle, non-judgmental space focusing on cognitive-behavioral techniques, healthy boundaries, and calm long-term stabilization.",
                photo: "https://images.unsplash.com/photo-1594824813575-573516428e24?w=300&h=300&fit=crop&crop=face",
                specialties: ["Substance & Alcohol Recovery", "Anxiety & Panic", "Women's Recovery Support"]
            },
            {
                name: "Dr. Kamrul Hasan",
                email: "dr.kamrul@example.com",
                phone: "01919998833",
                license: "BMDC-A-67214",
                fee: 1500.00,
                experience: 11,
                bio: "Specializing in sleep restoration, managing acute withdrawal fatigue, and physical wellness grounding.",
                photo: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&h=300&fit=crop&crop=face",
                specialties: ["Sleep & Insomnia", "Anxiety & Panic"]
            }
        ];

        for (const doc of doctorsData) {
            // Create user for doctor
            await connection.execute(
                `INSERT INTO users (full_name, email, phone, password_hash, role, profile_image, is_active)
                 VALUES (?, ?, ?, ?, 'doctor', ?, 1)
                 ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), profile_image = VALUES(profile_image)`,
                [doc.name, doc.email, doc.phone, defaultHash, doc.photo]
            );

            const [docUser] = await connection.execute(`SELECT id FROM users WHERE email = ?`, [doc.email]);
            const docUserId = docUser[0].id;

            // Create doctor profile
            await connection.execute(
                `INSERT INTO doctor_profiles 
                 (user_id, license_number, bio, experience_years, consultation_fee, approval_status)
                 VALUES (?, ?, ?, ?, ?, 'approved')
                 ON DUPLICATE KEY UPDATE bio = VALUES(bio), consultation_fee = VALUES(consultation_fee), approval_status = 'approved'`,
                [docUserId, doc.license, doc.bio, doc.experience, doc.fee]
            );

            const [dpRow] = await connection.execute(`SELECT id FROM doctor_profiles WHERE user_id = ?`, [docUserId]);
            const dpId = dpRow[0].id;

            // Map specialties
            for (const sName of doc.specialties) {
                const [specRow] = await connection.execute(`SELECT id FROM specialties WHERE name = ?`, [sName]);
                if (specRow.length > 0) {
                    await connection.execute(
                        `INSERT IGNORE INTO doctor_specialties (doctor_id, specialty_id) VALUES (?, ?)`,
                        [dpId, specRow[0].id]
                    );
                }
            }
        }

        // 5. Seed sample appointment and payment for Shanto
        const [tanvirProfile] = await connection.execute(
            `SELECT dp.id FROM doctor_profiles dp JOIN users u ON dp.user_id = u.id WHERE u.email = 'dr.tanvir@example.com'`
        );
        const tanvirId = tanvirProfile[0].id;

        const [aptRes] = await connection.execute(
            `INSERT INTO appointments 
             (patient_id, doctor_id, scheduled_at, duration_minutes, consultation_mode, concerns, consent_to_share_data, status)
             VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 1 DAY), 30, 'online', 'General check-in & review of evening sleep routine', 1, 'confirmed')`,
            [shantoId, tanvirId]
        );

        await connection.execute(
            `INSERT INTO payments 
             (appointment_id, amount, currency, payment_method, transaction_reference, status, paid_at)
             VALUES (?, 2000.00, 'BDT', 'bkash', 'TXN-BKASH-771234', 'paid', NOW())`,
            [aptRes.insertId]
        );

        // 6. Seed sample medical report for Shanto
        await connection.execute(
            `INSERT INTO medical_reports 
             (user_id, report_title, report_type, file_name, storage_path)
             VALUES (?, 'Liver Function & Metabolic Panel', 'Blood Chemistry', 'liver_panel_oct2026.pdf', 'uploads/reports/sample.pdf')`,
            [shantoId]
        );

        // 7. Seed welcome notification for Shanto
        await connection.execute(
            `INSERT INTO notifications 
             (user_id, title, message, notification_type, is_read)
             VALUES (?, 'Welcome to Pathway', 'Your compassionate health and recovery space is active and secure.', 'motivation', 0)`,
            [shantoId]
        );

        await connection.commit();
        console.log("Database seeded successfully!");
        return true;
    } catch (error) {
        await connection.rollback();
        console.error("Database Seeding Failed:", error);
        throw error;
    } finally {
        connection.release();
    }
}

// If executed directly from CLI: node src/config/seed.js
if (process.argv[1]?.endsWith("seed.js")) {
    seedDatabase()
        .then(() => {
            console.log("Done.");
            process.exit(0);
        })
        .catch((err) => {
            console.error(err);
            process.exit(1);
        });
}
