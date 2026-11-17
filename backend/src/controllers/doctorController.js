import pool from "../config/db.js";

// GET /api/doctors - List all approved doctors with specialties
export const getDoctors = async (req, res) => {
    try {
        const { search, specialty, sortBy } = req.query;

        let query = `
            SELECT 
                dp.id,
                dp.user_id,
                u.full_name AS name,
                u.email,
                u.phone,
                u.profile_image AS photo,
                dp.license_number,
                dp.bio,
                dp.experience_years AS experienceYears,
                dp.consultation_fee AS feeBDT,
                dp.approval_status,
                dp.created_at,
                GROUP_CONCAT(s.name SEPARATOR ', ') AS specialtiesList
            FROM doctor_profiles dp
            JOIN users u ON dp.user_id = u.id
            LEFT JOIN doctor_specialties ds ON dp.id = ds.doctor_id
            LEFT JOIN specialties s ON ds.specialty_id = s.id
            WHERE u.is_active = TRUE AND dp.approval_status = 'approved'
        `;

        const params = [];

        if (search && search.trim()) {
            query += ` AND (u.full_name LIKE ? OR dp.bio LIKE ? OR s.name LIKE ?)`;
            const searchParam = `%${search.trim()}%`;
            params.push(searchParam, searchParam, searchParam);
        }

        query += ` GROUP BY dp.id`;

        if (specialty && specialty !== 'all') {
            query += ` HAVING specialtiesList LIKE ?`;
            params.push(`%${specialty.trim()}%`);
        }

        if (sortBy === 'lowestFee') {
            query += ` ORDER BY dp.consultation_fee ASC`;
        } else if (sortBy === 'experience') {
            query += ` ORDER BY dp.experience_years DESC`;
        } else {
            query += ` ORDER BY dp.id ASC`;
        }

        const [rows] = await pool.execute(query, params);

        const doctors = rows.map((row) => {
            const specialtiesArray = row.specialtiesList
                ? row.specialtiesList.split(', ')
                : ['General Psychiatry'];
            
            return {
                id: String(row.id),
                userId: row.user_id,
                name: row.name,
                nameBn: row.name,
                title: 'Consultant Psychiatrist',
                titleBn: 'কনসালটেন্ট সাইকিয়াট্রিস্ট',
                qualifications: 'MBBS, FCPS (Psychiatry)',
                experienceYears: Number(row.experienceYears) || 5,
                photo: row.photo || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=300&fit=crop&crop=face',
                gender: 'male',
                languages: ['Bangla', 'English'],
                languagesBn: ['বাংলা', 'ইংরেজি'],
                specialties: specialtiesArray,
                specialtiesBn: specialtiesArray,
                feeBDT: Number(row.feeBDT) || 1500,
                hospital: 'National Institute of Mental Health',
                hospitalBn: 'জাতীয় মানসিক স্বাস্থ্য ইনস্টিটিউট',
                clinicAddress: 'Dhanmondi, Dhaka',
                clinicAddressBn: 'ধানমন্ডি, ঢাকা',
                city: 'Dhaka',
                cityBn: 'ঢাকা',
                consultationModes: ['online', 'in_person'],
                nextFreeSlot: 'Tomorrow, 04:30 PM',
                nextFreeSlotBn: 'আগামীকাল, বিকাল ৪:৩০',
                about: row.bio || 'Compassionate and experienced mental health professional.',
                aboutBn: row.bio || 'সহানুভূতিশীল ও অভিজ্ঞ মানসিক স্বাস্থ্য বিশেষজ্ঞ।'
            };
        });

        return res.json({
            success: true,
            count: doctors.length,
            doctors
        });
    } catch (error) {
        console.error("Get Doctors Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve doctors list."
        });
    }
};

// GET /api/doctors/:id - Single doctor details
export const getDoctorById = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await pool.execute(
            `SELECT 
                dp.id,
                dp.user_id,
                u.full_name AS name,
                u.email,
                u.phone,
                u.profile_image AS photo,
                dp.license_number,
                dp.bio,
                dp.experience_years AS experienceYears,
                dp.consultation_fee AS feeBDT,
                dp.approval_status,
                GROUP_CONCAT(s.name SEPARATOR ', ') AS specialtiesList
            FROM doctor_profiles dp
            JOIN users u ON dp.user_id = u.id
            LEFT JOIN doctor_specialties ds ON dp.id = ds.doctor_id
            LEFT JOIN specialties s ON ds.specialty_id = s.id
            WHERE dp.id = ? AND u.is_active = TRUE
            GROUP BY dp.id`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found."
            });
        }

        const row = rows[0];
        const specialtiesArray = row.specialtiesList
            ? row.specialtiesList.split(', ')
            : ['General Psychiatry'];

        const doctor = {
            id: String(row.id),
            userId: row.user_id,
            name: row.name,
            nameBn: row.name,
            title: 'Consultant Psychiatrist',
            titleBn: 'কনসালটেন্ট সাইকিয়াট্রিস্ট',
            qualifications: 'MBBS, FCPS (Psychiatry)',
            experienceYears: Number(row.experienceYears) || 5,
            photo: row.photo || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=300&fit=crop&crop=face',
            gender: 'male',
            languages: ['Bangla', 'English'],
            languagesBn: ['বাংলা', 'ইংরেজি'],
            specialties: specialtiesArray,
            specialtiesBn: specialtiesArray,
            feeBDT: Number(row.feeBDT) || 1500,
            hospital: 'National Institute of Mental Health',
            hospitalBn: 'জাতীয় মানসিক স্বাস্থ্য ইনস্টিটিউট',
            clinicAddress: 'Dhanmondi, Dhaka',
            clinicAddressBn: 'ধানমন্ডি, ঢাকা',
            city: 'Dhaka',
            cityBn: 'ঢাকা',
            consultationModes: ['online', 'in_person'],
            nextFreeSlot: 'Tomorrow, 04:30 PM',
            nextFreeSlotBn: 'আগামীকাল, বিকাল ৪:৩০',
            about: row.bio || 'Compassionate care for recovery and stabilization.',
            aboutBn: row.bio || 'সহানুভূতিশীল মানসিক স্বাস্থ্য সহায়তা।'
        };

        return res.json({
            success: true,
            doctor
        });
    } catch (error) {
        console.error("Get Doctor By ID Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve doctor details."
        });
    }
};

// GET /api/doctors/:id/slots - Available appointment slots for doctor
export const getDoctorSlots = async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch existing appointments for this doctor in the future
        const [booked] = await pool.execute(
            `SELECT scheduled_at, consultation_mode
             FROM appointments
             WHERE doctor_id = ? AND scheduled_at >= NOW() AND status IN ('pending', 'confirmed')`,
            [id]
        );

        const bookedDates = new Set(
            booked.map((b) => new Date(b.scheduled_at).toISOString().slice(0, 16))
        );

        // Generate next 5 days of slots (10:00 AM, 02:30 PM, 04:30 PM, 07:00 PM)
        const times = ['10:00 AM', '02:30 PM', '04:30 PM', '07:00 PM'];
        const slots = [];
        const today = new Date();

        for (let dayOffset = 1; dayOffset <= 5; dayOffset++) {
            const dateObj = new Date(today);
            dateObj.setDate(today.getDate() + dayOffset);
            const dateStr = dateObj.toISOString().split('T')[0];

            times.forEach((t) => {
                slots.push({
                    doctorId: String(id),
                    date: dateStr,
                    time: t,
                    mode: 'online',
                    isBooked: false
                });
            });
        }

        return res.json({
            success: true,
            slots
        });
    } catch (error) {
        console.error("Get Doctor Slots Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve doctor schedule."
        });
    }
};

// GET /api/doctors/meta/specialties - List all registered specialties
export const getSpecialties = async (req, res) => {
    try {
        const [rows] = await pool.execute(`SELECT id, name, description FROM specialties ORDER BY name ASC`);
        return res.json({
            success: true,
            specialties: rows
        });
    } catch (error) {
        console.error("Get Specialties Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve specialties."
        });
    }
};
