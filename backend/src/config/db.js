import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

const connectionUri = process.env.MYSQL_URL || process.env.DATABASE_URL;

function createMockPool() {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 86400000);
    const defaultHash = bcrypt.hashSync("Password123", 10);

    const state = {
        nextId: {
            users: 10,
            doctor_profiles: 10,
            appointments: 10,
            payments: 10,
            medical_reports: 10,
            notifications: 10,
            user_goals: 10
        },
        specialties: [
            { id: 1, name: "Substance & Alcohol Recovery", description: "Comprehensive evidence-based recovery care and stabilization." },
            { id: 2, name: "Sleep & Insomnia", description: "Restorative sleep techniques and circadian regulation." },
            { id: 3, name: "Depression & Mood Care", description: "Gentle evidence-backed mood care and coping support." },
            { id: 4, name: "Anxiety & Panic", description: "Cognitive calming strategies for anxiety and panic reduction." },
            { id: 5, name: "Relapse Prevention", description: "Trigger identification, craving surfing, and long-term sobriety." },
            { id: 6, name: "Women's Recovery Support", description: "Specialized, empathetic care for women navigating dependence." },
            { id: 7, name: "Family & Caregiver Support", description: "Family boundary guidance and healing communication." }
        ],
        goal_templates: [
            { id: 1, title: "Box Breathing for Inner Peace", description: "Slow 4-second box breathing to calm the nervous system.", points: 25, is_active: 1 },
            { id: 2, title: "Cool Water Reset", description: "Drink a full tall glass of clean water slowly to replenish hydration.", points: 15, is_active: 1 },
            { id: 3, title: "10-Minute Mindful Fresh Air Walk", description: "Gentle stroll noticing colors, sensations, and peaceful natural rhythm.", points: 20, is_active: 1 },
            { id: 4, title: "Evening Gratitude & Safe Reflection", description: "Note one kind thing you did for yourself or someone else today.", points: 15, is_active: 1 },
            { id: 5, title: "15-Minute Urge Surfing Practice", description: "Ride cravings like ocean waves without judgment until they dissipate.", points: 30, is_active: 1 }
        ],
        users: [
            {
                id: 1,
                full_name: "Shanto Chowdhury",
                email: "shanto@example.com",
                phone: "01711223344",
                password_hash: defaultHash,
                role: "patient",
                profile_image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face",
                is_active: 1,
                created_at: new Date("2026-10-15T10:00:00Z")
            },
            {
                id: 2,
                full_name: "Nabila Rahman",
                email: "nabila@example.com",
                phone: "01812345678",
                password_hash: defaultHash,
                role: "patient",
                profile_image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face",
                is_active: 1,
                created_at: new Date("2026-08-10T10:00:00Z")
            },
            {
                id: 3,
                full_name: "Prof. Dr. Tanvir Ahmed",
                email: "dr.tanvir@example.com",
                phone: "01719998811",
                password_hash: defaultHash,
                role: "doctor",
                profile_image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=300&fit=crop&crop=face",
                is_active: 1,
                created_at: now
            },
            {
                id: 4,
                full_name: "Dr. Nusrat Jahan",
                email: "dr.nusrat@example.com",
                phone: "01819998822",
                password_hash: defaultHash,
                role: "doctor",
                profile_image: "https://images.unsplash.com/photo-1594824813575-573516428e24?w=300&h=300&fit=crop&crop=face",
                is_active: 1,
                created_at: now
            },
            {
                id: 5,
                full_name: "Dr. Kamrul Hasan",
                email: "dr.kamrul@example.com",
                phone: "01919998833",
                password_hash: defaultHash,
                role: "doctor",
                profile_image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&h=300&fit=crop&crop=face",
                is_active: 1,
                created_at: now
            }
        ],
        doctor_profiles: [
            {
                id: 1,
                user_id: 3,
                license_number: "BMDC-A-48912",
                bio: "Over 18 years helping individuals and families navigate substance dependence with deep empathy, evidence-backed medical guidance, and practical coping plans.",
                experience_years: 18,
                consultation_fee: 2000,
                approval_status: "approved",
                created_at: now
            },
            {
                id: 2,
                user_id: 4,
                license_number: "BMDC-A-59123",
                bio: "Gentle, non-judgmental space focusing on cognitive-behavioral techniques, healthy boundaries, and calm long-term stabilization.",
                experience_years: 14,
                consultation_fee: 1800,
                approval_status: "approved",
                created_at: now
            },
            {
                id: 3,
                user_id: 5,
                license_number: "BMDC-A-67214",
                bio: "Specializing in sleep restoration, managing acute withdrawal fatigue, and physical wellness grounding.",
                experience_years: 11,
                consultation_fee: 1500,
                approval_status: "approved",
                created_at: now
            }
        ],
        doctor_specialties: [
            { doctor_id: 1, specialty_id: 1 },
            { doctor_id: 1, specialty_id: 3 },
            { doctor_id: 1, specialty_id: 5 },
            { doctor_id: 2, specialty_id: 1 },
            { doctor_id: 2, specialty_id: 4 },
            { doctor_id: 2, specialty_id: 6 },
            { doctor_id: 3, specialty_id: 2 },
            { doctor_id: 3, specialty_id: 4 }
        ],
        appointments: [
            {
                id: 1,
                patient_id: 1,
                doctor_id: 1,
                scheduled_at: tomorrow,
                duration_minutes: 30,
                consultation_mode: "online",
                concerns: "General check-in & review of evening sleep routine",
                consent_to_share_data: 1,
                status: "confirmed",
                created_at: now
            }
        ],
        payments: [
            {
                id: 1,
                appointment_id: 1,
                amount: 2000,
                currency: "BDT",
                payment_method: "bkash",
                transaction_reference: "TXN-BKASH-771234",
                status: "paid",
                paid_at: now,
                created_at: now
            }
        ],
        medical_reports: [
            {
                id: 1,
                user_id: 1,
                report_title: "Liver Function & Metabolic Panel",
                report_type: "Blood Chemistry",
                file_name: "liver_panel_oct2026.pdf",
                storage_path: "uploads/reports/sample.pdf",
                uploaded_at: now
            }
        ],
        notifications: [
            {
                id: 1,
                user_id: 1,
                title: "Welcome to Pathway",
                message: "Your compassionate health and recovery space is active and secure.",
                notification_type: "motivation",
                is_read: 0,
                created_at: now
            }
        ],
        user_goals: []
    };

    async function runQuery(sql, params = []) {
        const normalized = sql.replace(/\s+/g, " ").trim();
        const lower = normalized.toLowerCase();

        if (lower.includes("select database()")) {
            return [[{ database_name: "pathway_mock_memory", server_time: new Date() }]];
        }

        // Auth middleware user lookup
        if (lower.startsWith("select id, role, is_active from users where id = ?")) {
            const user = state.users.find((u) => String(u.id) === String(params[0]));
            return [user ? [{ id: user.id, role: user.role, is_active: user.is_active }] : []];
        }

        // Patient registration duplicate check
        if (lower === "select id from users where email = ?") {
            const found = state.users.filter((u) => u.email.toLowerCase() === String(params[0]).toLowerCase());
            return [found.map((u) => ({ id: u.id }))];
        }

        // Doctor registration duplicate check
        if (lower.includes("from users where email = ? union select user_id as id from doctor_profiles")) {
            const emailMatch = state.users.filter((u) => u.email.toLowerCase() === String(params[0]).toLowerCase());
            const licMatch = state.doctor_profiles.filter((d) => d.license_number === params[1]);
            const combined = [...emailMatch.map((u) => ({ id: u.id })), ...licMatch.map((d) => ({ id: d.user_id }))];
            return [combined];
        }

        // Login user lookup
        if (lower.includes("from users where email = ? limit 1")) {
            const user = state.users.find((u) => u.email.toLowerCase() === String(params[0]).toLowerCase());
            return [user ? [user] : []];
        }

        // Doctor approval status lookup
        if (lower.startsWith("select approval_status from doctor_profiles where user_id = ?")) {
            const dp = state.doctor_profiles.find((d) => String(d.user_id) === String(params[0]));
            return [dp ? [{ approval_status: dp.approval_status }] : []];
        }

        // Current user or profile fetch
        if (lower.includes("from users where id = ?") && lower.includes("full_name")) {
            const requireActive = lower.includes("is_active = true");
            const user = state.users.find(
                (u) => String(u.id) === String(params[0]) && (!requireActive || u.is_active)
            );
            return [user ? [user] : []];
        }

        // Password hash lookup
        if (lower.startsWith("select password_hash from users where id = ?")) {
            const user = state.users.find((u) => String(u.id) === String(params[0]));
            return [user ? [{ password_hash: user.password_hash }] : []];
        }

        // Insert user
        if (lower.startsWith("insert into users")) {
            const isDoctor = lower.includes("'doctor'");
            const newId = state.nextId.users++;
            const newUser = {
                id: newId,
                full_name: params[0],
                email: params[1],
                phone: params[2] || null,
                password_hash: params[3],
                role: isDoctor ? "doctor" : "patient",
                profile_image: null,
                is_active: 1,
                created_at: new Date()
            };
            state.users.push(newUser);
            return [{ insertId: newId, affectedRows: 1 }];
        }

        // Update user password
        if (lower.startsWith("update users set password_hash = ? where id = ?")) {
            const user = state.users.find((u) => String(u.id) === String(params[1]));
            if (user) {
                user.password_hash = params[0];
                return [{ affectedRows: 1 }];
            }
            return [{ affectedRows: 0 }];
        }

        // Update user profile
        if (lower.startsWith("update users set ") && lower.includes("where id = ?")) {
            const userId = params[params.length - 1];
            const user = state.users.find((u) => String(u.id) === String(userId));
            if (!user) return [{ affectedRows: 0 }];
            const setClause = normalized.slice(normalized.toLowerCase().indexOf("set ") + 4, normalized.toLowerCase().lastIndexOf(" where"));
            const fields = setClause.split(",").map((f) => f.trim().split("=")[0].trim());
            fields.forEach((field, idx) => {
                user[field] = params[idx];
            });
            return [{ affectedRows: 1 }];
        }

        // Insert doctor profile
        if (lower.startsWith("insert into doctor_profiles")) {
            const newId = state.nextId.doctor_profiles++;
            state.doctor_profiles.push({
                id: newId,
                user_id: params[0],
                license_number: params[1],
                bio: params[2],
                experience_years: params[3],
                consultation_fee: params[4],
                approval_status: "pending",
                created_at: new Date()
            });
            return [{ insertId: newId, affectedRows: 1 }];
        }

        // Specialties list
        if (lower.includes("from specialties")) {
            return [[...state.specialties].sort((a, b) => a.name.localeCompare(b.name))];
        }

        // Doctors list or single doctor
        if (lower.includes("from doctor_profiles dp join users u")) {
            // Booking doctor check
            if (!lower.includes("group_concat")) {
                const dp = state.doctor_profiles.find((d) => String(d.id) === String(params[0]));
                if (!dp) return [[]];
                const u = state.users.find((usr) => usr.id === dp.user_id);
                return [[{ id: dp.id, full_name: u?.full_name || "Doctor", consultation_fee: dp.consultation_fee }]];
            }

            let results = state.doctor_profiles
                .map((dp) => {
                    const u = state.users.find((usr) => usr.id === dp.user_id);
                    if (!u || !u.is_active) return null;
                    const specNames = state.doctor_specialties
                        .filter((ds) => ds.doctor_id === dp.id)
                        .map((ds) => state.specialties.find((s) => s.id === ds.specialty_id)?.name)
                        .filter(Boolean);
                    return {
                        id: dp.id,
                        user_id: dp.user_id,
                        name: u.full_name,
                        email: u.email,
                        phone: u.phone,
                        photo: u.profile_image,
                        license_number: dp.license_number,
                        bio: dp.bio,
                        experienceYears: dp.experience_years,
                        feeBDT: dp.consultation_fee,
                        approval_status: dp.approval_status,
                        created_at: dp.created_at,
                        specialtiesList: specNames.join(", ")
                    };
                })
                .filter(Boolean);

            if (lower.includes("where dp.id = ?")) {
                results = results.filter((r) => String(r.id) === String(params[0]));
            } else {
                results = results.filter((r) => r.approval_status === "approved");
                let paramIdx = 0;
                if (lower.includes("u.full_name like ?")) {
                    const q = String(params[paramIdx]).replace(/%/g, "").toLowerCase();
                    paramIdx += 3;
                    results = results.filter(
                        (r) =>
                            r.name.toLowerCase().includes(q) ||
                            (r.bio && r.bio.toLowerCase().includes(q)) ||
                            r.specialtiesList.toLowerCase().includes(q)
                    );
                }
                if (lower.includes("having specialtieslist like ?")) {
                    const sp = String(params[paramIdx]).replace(/%/g, "").toLowerCase();
                    results = results.filter((r) => r.specialtiesList.toLowerCase().includes(sp));
                }
                if (lower.includes("order by dp.consultation_fee asc")) {
                    results.sort((a, b) => a.feeBDT - b.feeBDT);
                } else if (lower.includes("order by dp.experience_years desc")) {
                    results.sort((a, b) => b.experienceYears - a.experienceYears);
                }
            }
            return [results];
        }

        // Doctor slots booked check
        if (lower.startsWith("select scheduled_at, consultation_mode from appointments where doctor_id = ?")) {
            const rows = state.appointments.filter(
                (a) => String(a.doctor_id) === String(params[0]) && ["pending", "confirmed"].includes(a.status)
            );
            return [rows];
        }

        // Appointment double-booking check
        if (lower.startsWith("select id from appointments where doctor_id = ? and scheduled_at = ?")) {
            const rows = state.appointments.filter(
                (a) =>
                    String(a.doctor_id) === String(params[0]) &&
                    String(a.scheduled_at) === String(params[1]) &&
                    ["pending", "confirmed"].includes(a.status)
            );
            return [rows];
        }

        // Insert appointment
        if (lower.startsWith("insert into appointments")) {
            const newId = state.nextId.appointments++;
            state.appointments.unshift({
                id: newId,
                patient_id: params[0],
                doctor_id: Number(params[1]),
                scheduled_at: params[2],
                duration_minutes: 30,
                consultation_mode: params[3],
                concerns: params[4],
                consent_to_share_data: params[5],
                status: "confirmed",
                created_at: new Date()
            });
            return [{ insertId: newId, affectedRows: 1 }];
        }

        // Get my appointments
        if (lower.includes("from appointments a join doctor_profiles dp")) {
            const isDoctorQuery = lower.includes("where dp.user_id = ?");
            const rows = state.appointments
                .map((a) => {
                    const dp = state.doctor_profiles.find((d) => String(d.id) === String(a.doctor_id));
                    const du = dp ? state.users.find((u) => u.id === dp.user_id) : null;
                    const pu = state.users.find((u) => String(u.id) === String(a.patient_id));
                    const pay = state.payments.find((p) => String(p.appointment_id) === String(a.id));
                    if (isDoctorQuery) {
                        if (!dp || String(dp.user_id) !== String(params[0])) return null;
                    } else {
                        if (String(a.patient_id) !== String(params[0])) return null;
                    }
                    return {
                        id: a.id,
                        patient_id: a.patient_id,
                        doctor_id: a.doctor_id,
                        scheduled_at: a.scheduled_at,
                        duration_minutes: a.duration_minutes,
                        consultation_mode: a.consultation_mode,
                        concerns: a.concerns,
                        status: a.status,
                        created_at: a.created_at,
                        patientName: pu?.full_name || "Patient",
                        patientEmail: pu?.email || "",
                        patientPhone: pu?.phone || "",
                        doctorName: du?.full_name || "Doctor",
                        doctorPhoto: du?.profile_image || null,
                        feeBDT: pay?.amount || dp?.consultation_fee || 1500,
                        payment_method: pay?.payment_method || "bkash",
                        paymentStatus: pay?.status || "paid"
                    };
                })
                .filter(Boolean);
            return [rows];
        }

        // Update appointment status
        if (lower.startsWith("update appointments set status = ? where id = ?")) {
            const [status, rawId, userId] = params;
            const apt = state.appointments.find((a) => String(a.id) === String(rawId));
            if (!apt) return [{ affectedRows: 0 }];
            const dp = state.doctor_profiles.find((d) => String(d.id) === String(apt.doctor_id));
            if (String(apt.patient_id) !== String(userId) && (!dp || String(dp.user_id) !== String(userId))) {
                return [{ affectedRows: 0 }];
            }
            apt.status = status;
            return [{ affectedRows: 1 }];
        }

        // Insert payment
        if (lower.startsWith("insert into payments")) {
            const newId = state.nextId.payments++;
            state.payments.unshift({
                id: newId,
                appointment_id: params[0],
                amount: params[1],
                currency: "BDT",
                payment_method: params[2],
                transaction_reference: params[3],
                status: "paid",
                paid_at: new Date(),
                created_at: new Date()
            });
            return [{ insertId: newId, affectedRows: 1 }];
        }

        // Get my payments
        if (lower.includes("from payments p join appointments a")) {
            const userId = params[0];
            const rows = state.payments
                .map((p) => {
                    const a = state.appointments.find((apt) => String(apt.id) === String(p.appointment_id));
                    if (!a || String(a.patient_id) !== String(userId)) return null;
                    const dp = state.doctor_profiles.find((d) => String(d.id) === String(a.doctor_id));
                    const du = dp ? state.users.find((u) => u.id === dp.user_id) : null;
                    return {
                        ...p,
                        doctorName: du?.full_name || "Specialist"
                    };
                })
                .filter(Boolean);
            return [rows];
        }

        // Insert notification
        if (lower.startsWith("insert into notifications")) {
            const newId = state.nextId.notifications++;
            state.notifications.unshift({
                id: newId,
                user_id: params[0],
                title: lower.includes("'appointment confirmed'") ? "Appointment Confirmed" : "Notification",
                message: params[1],
                notification_type: "visits",
                is_read: 0,
                created_at: new Date()
            });
            return [{ insertId: newId, affectedRows: 1 }];
        }

        // Get notifications
        if (lower.includes("from notifications where user_id = ?")) {
            const rows = state.notifications.filter((n) => String(n.user_id) === String(params[0]));
            return [rows];
        }

        // Mark notification read
        if (lower.startsWith("update notifications set is_read = 1 where id = ? and user_id = ?")) {
            const notif = state.notifications.find(
                (n) => String(n.id) === String(params[0]) && String(n.user_id) === String(params[1])
            );
            if (notif) notif.is_read = 1;
            return [{ affectedRows: notif ? 1 : 0 }];
        }

        if (lower.startsWith("update notifications set is_read = 1 where user_id = ?")) {
            state.notifications.forEach((n) => {
                if (String(n.user_id) === String(params[0])) n.is_read = 1;
            });
            return [{ affectedRows: 1 }];
        }

        // User goals query
        if (lower.includes("from user_goals ug join goal_templates gt") && lower.includes("assigned_date = ?")) {
            const [userId, dateStr] = params;
            const rows = state.user_goals
                .filter((ug) => String(ug.user_id) === String(userId) && ug.assigned_date === dateStr)
                .map((ug) => {
                    const gt = state.goal_templates.find((t) => String(t.id) === String(ug.goal_template_id));
                    if (!gt) return null;
                    return {
                        userGoalId: ug.id,
                        is_completed: ug.is_completed,
                        completed_at: ug.completed_at,
                        templateId: gt.id,
                        title: gt.title,
                        description: gt.description,
                        points: gt.points
                    };
                })
                .filter(Boolean);
            return [rows];
        }

        // Goal templates list
        if (lower.includes("from goal_templates where is_active = true")) {
            const active = state.goal_templates.filter((t) => t.is_active);
            return [lower.includes("limit 4") ? active.slice(0, 4) : active];
        }

        if (lower.startsWith("select id, title, points from goal_templates where id = ?")) {
            const gt = state.goal_templates.find((t) => String(t.id) === String(params[0]));
            return [gt ? [gt] : []];
        }

        // Insert ignore user_goals
        if (lower.startsWith("insert ignore into user_goals")) {
            const [userId, templateId, dateStr] = params;
            const exists = state.user_goals.some(
                (ug) => String(ug.user_id) === String(userId) && String(ug.goal_template_id) === String(templateId) && ug.assigned_date === dateStr
            );
            if (!exists) {
                state.user_goals.push({
                    id: state.nextId.user_goals++,
                    user_id: userId,
                    goal_template_id: Number(templateId),
                    assigned_date: dateStr,
                    is_completed: 0,
                    completed_at: null
                });
            }
            return [{ affectedRows: exists ? 0 : 1 }];
        }

        // Complete user_goal upsert
        if (lower.startsWith("insert into user_goals") && lower.includes("on duplicate key update is_completed = 1")) {
            const [userId, templateId, dateStr] = params;
            const existing = state.user_goals.find(
                (ug) => String(ug.user_id) === String(userId) && String(ug.goal_template_id) === String(templateId) && ug.assigned_date === dateStr
            );
            if (existing) {
                existing.is_completed = 1;
                existing.completed_at = new Date();
            } else {
                state.user_goals.push({
                    id: state.nextId.user_goals++,
                    user_id: userId,
                    goal_template_id: Number(templateId),
                    assigned_date: dateStr,
                    is_completed: 1,
                    completed_at: new Date()
                });
            }
            return [{ affectedRows: 1 }];
        }

        // Total points
        if (lower.includes("sum(gt.points)")) {
            const userId = params[0];
            const totalPoints = state.user_goals
                .filter((ug) => String(ug.user_id) === String(userId) && ug.is_completed)
                .reduce((acc, ug) => {
                    const gt = state.goal_templates.find((t) => String(t.id) === String(ug.goal_template_id));
                    return acc + (gt ? Number(gt.points) : 0);
                }, 0);
            return [[{ totalPoints }]];
        }

        // Medical reports
        if (lower.includes("from medical_reports where user_id = ?")) {
            const rows = state.medical_reports.filter((r) => String(r.user_id) === String(params[0]));
            return [rows];
        }

        if (lower.startsWith("insert into medical_reports")) {
            const newId = state.nextId.medical_reports++;
            state.medical_reports.unshift({
                id: newId,
                user_id: params[0],
                report_title: params[1],
                report_type: params[2],
                file_name: params[3],
                storage_path: params[4],
                uploaded_at: new Date()
            });
            return [{ insertId: newId, affectedRows: 1 }];
        }

        if (lower.startsWith("delete from medical_reports where id = ? and user_id = ?")) {
            const idx = state.medical_reports.findIndex(
                (r) => String(r.id) === String(params[0]) && String(r.user_id) === String(params[1])
            );
            if (idx === -1) return [{ affectedRows: 0 }];
            state.medical_reports.splice(idx, 1);
            return [{ affectedRows: 1 }];
        }

        return [[]];
    }

    const mockConnection = {
        execute: runQuery,
        query: runQuery,
        beginTransaction: async () => {},
        commit: async () => {},
        rollback: async () => {},
        release: () => {}
    };

    return {
        isMock: true,
        execute: runQuery,
        query: runQuery,
        getConnection: async () => mockConnection
    };
}

let activePool = null;

const hasExplicitMysqlConfig = Boolean(
    connectionUri ||
    process.env.DB_HOST ||
    process.env.DB_USER ||
    process.env.DB_PASSWORD
);

if (hasExplicitMysqlConfig) {
    try {
        activePool = connectionUri
            ? mysql.createPool({
                  uri: connectionUri,
                  waitForConnections: true,
                  connectionLimit: 10,
                  queueLimit: 0,
                  connectTimeout: 2000,
                  charset: "utf8mb4"
              })
            : mysql.createPool({
                  host: process.env.DB_HOST || "localhost",
                  port: Number(process.env.DB_PORT) || 3306,
                  user: process.env.DB_USER || "root",
                  password: process.env.DB_PASSWORD || "",
                  database: process.env.DB_NAME || "pathway_healthcare",
                  waitForConnections: true,
                  connectionLimit: 10,
                  queueLimit: 0,
                  connectTimeout: 2000,
                  charset: "utf8mb4"
              });
    } catch (err) {
        console.warn("[AI Studio] MySQL initialization failed — activating in-memory mock DB:", err.message);
        activePool = createMockPool();
    }
} else {
    console.warn("[AI Studio] No MySQL credentials configured — activating in-memory mock DB");
    activePool = createMockPool();
}

export async function verifyOrFallbackPool() {
    if (activePool.isMock) return false;
    try {
        const conn = await activePool.getConnection();
        conn.release();
        return true;
    } catch (err) {
        console.warn("[AI Studio] MySQL unreachable — switching to in-memory mock DB:", err.message);
        activePool = createMockPool();
        return false;
    }
}

const poolProxy = {
    execute: (...args) => activePool.execute(...args),
    query: (...args) => activePool.query(...args),
    getConnection: (...args) => activePool.getConnection(...args)
};

export default poolProxy;
