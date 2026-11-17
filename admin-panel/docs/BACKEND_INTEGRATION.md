# Pathway Admin CMS — Backend & MySQL Integration Guide

This document describes how **Pathway Admin CMS** (`/admin-panel/`) connects to the existing Pathway Express.js + MySQL backend (`/backend/`) and how the public Pathway website (`/frontend/`) can cleanly consume published CMS content without mixing admin and public codebases.

> **Current Status:** `/admin-panel/` runs in self-contained mock/demo mode (`VITE_USE_MOCK=true`) with an Axios service layer ready for backend cutover (`VITE_USE_MOCK=false`). Neither `/frontend/` nor `/backend/` has been modified during Admin CMS frontend development.

---

## 1. Existing Backend & MySQL Inventory

### 1.1 Mounted Express Routes (`/backend/src/server.js`)
The existing backend runs on `PORT = Number(process.env.PORT) || 3000` and currently mounts:

| Prefix | Route File | Purpose |
| :--- | :--- | :--- |
| `/api/auth` | `authRoutes.js` | `POST /register/patient`, `POST /register/doctor`, `POST /login`, `GET /me` (`protect`) |
| `/api/doctors` | `doctorRoutes.js` | `GET /specialties`, `GET /`, `GET /:id`, `GET /:id/slots` |
| `/api/appointments` | `appointmentRoutes.js` | `POST /`, `GET /my`, `PATCH /:id/status` (protected) |
| `/api/goals` | `goalRoutes.js` | Patient daily goals & templates |
| `/api/reports` | `reportRoutes.js` | Medical report metadata & storage paths |
| `/api/notifications` | `notificationRoutes.js` | In-app notifications |
| `/api/payments` | `paymentRoutes.js` | Appointment payment records |
| `/api/users` | `userRoutes.js` | `PATCH /profile`, `PATCH /password` (self-service) |
| `/api/health`, `/api/db-health` | `server.js` | Service & MySQL pool health checks |

### 1.2 Existing MySQL Tables (`/backend/schema.sql`)

| Existing Table | Key Columns Used by Admin CMS | Notes / Gaps for Full Admin Parity |
| :--- | :--- | :--- |
| `users` | `id`, `full_name`, `email`, `phone`, `password_hash`, `role` (`'patient'\|'doctor'\|'admin'`), `profile_image`, `is_active`, `created_at`, `updated_at` | Needs `admin_subrole`, `account_status` (`active\|paused\|locked\|pending_deletion\|inactive`), `last_login_at`, `plan` (`free\|premium`), `share_recovery_with_admin` |
| `doctor_profiles` | `id`, `user_id`, `license_number`, `bio`, `experience_years`, `consultation_fee`, `approval_status` (`'pending'\|'approved'\|'rejected'`), `created_at` | Needs `qualifications`, `hospital`, `city`, `review_notes`, `reviewed_by`, `reviewed_at` |
| `specialties` & `doctor_specialties` | `id`, `name`, `description`; join table `(doctor_id, specialty_id)` | Directly usable for specialty breakdown analytics |
| `appointments` | `id`, `patient_id`, `doctor_id`, `scheduled_at`, `duration_minutes`, `consultation_mode` (`'online'\|'in_person'`), `concerns`, `consent_to_share_data`, `status` (`'pending'\|'confirmed'\|'cancelled'\|'completed'\|'rejected'`), `created_at`, `updated_at` | Directly maps to Admin Appointment Management; `concerns` must remain gated by `consent_to_share_data` |
| `payments` | `id`, `appointment_id`, `amount`, `currency`, `payment_method`, `transaction_reference`, `status` (`'pending'\|'paid'\|'failed'\|'refunded'`), `paid_at` | Directly maps to appointment payment status & revenue metrics |
| `goal_templates` & `user_goals` | `title`, `description`, `points`, `is_active`; `user_id`, `goal_template_id`, `assigned_date`, `is_completed`, `completed_at` | Powers consented user recovery progress in `UserDetail` |
| `medical_reports` | `id`, `user_id`, `report_title`, `report_type`, `file_name`, `storage_path`, `uploaded_at` | Metadata-only (stores `storage_path`, not blobs) |
| `notifications` | `id`, `user_id`, `title`, `message`, `notification_type`, `is_read`, `created_at` | Can emit notifications when doctor applications are approved/rejected |

---

## 2. Required Database Additions (MySQL 8.0+)

To support full Website CMS versioning, RBAC granularity, activity auditing, and consent-gated recovery views without disturbing existing tables, apply a migration SQL script similar to:

```sql
-- 1. Extend users table for Admin RBAC, account lifecycle, and privacy consent
ALTER TABLE users
  ADD COLUMN account_status ENUM('active','paused','locked','pending_deletion','inactive') NOT NULL DEFAULT 'active' AFTER is_active,
  ADD COLUMN admin_subrole ENUM('super_admin','admin','content_manager','doctor_manager') NULL AFTER role,
  ADD COLUMN plan ENUM('free','premium') NOT NULL DEFAULT 'free' AFTER admin_subrole,
  ADD COLUMN city VARCHAR(120) NULL AFTER phone,
  ADD COLUMN share_recovery_with_admin TINYINT(1) NOT NULL DEFAULT 0,
  ADD COLUMN last_login_at TIMESTAMP NULL DEFAULT NULL;

-- 2. Extend doctor_profiles for BMDC verification audit trail & directory metadata
ALTER TABLE doctor_profiles
  ADD COLUMN qualifications VARCHAR(255) NULL AFTER license_number,
  ADD COLUMN hospital VARCHAR(190) NULL AFTER qualifications,
  ADD COLUMN city VARCHAR(120) NULL AFTER hospital,
  ADD COLUMN review_notes TEXT NULL AFTER approval_status,
  ADD COLUMN reviewed_by BIGINT UNSIGNED NULL AFTER review_notes,
  ADD COLUMN reviewed_at TIMESTAMP NULL DEFAULT NULL AFTER reviewed_by;

-- 3. Immutable admin & sensitive-access audit log
CREATE TABLE admin_activity_logs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  category ENUM(
    'user_registration',
    'doctor_registration',
    'doctor_review',
    'appointment',
    'account_change',
    'website_content',
    'admin_action'
  ) NOT NULL,
  action VARCHAR(190) NOT NULL,
  target VARCHAR(255) NOT NULL,
  details TEXT NOT NULL,
  actor_user_id BIGINT UNSIGNED NULL,
  actor_name VARCHAR(150) NOT NULL,
  actor_role VARCHAR(64) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_logs_category_created (category, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. CMS Sections (stores explicit separate Draft and Published JSON payloads)
CREATE TABLE cms_sections (
  section_key VARCHAR(64) NOT NULL PRIMARY KEY, -- homepage, navigation, about, contact, footer, seo
  draft_json JSON NOT NULL,
  published_json JSON NOT NULL,
  has_unpublished_changes TINYINT(1) NOT NULL DEFAULT 0,
  last_saved_draft_at TIMESTAMP NULL DEFAULT NULL,
  last_published_at TIMESTAMP NULL DEFAULT NULL,
  last_published_by VARCHAR(150) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. CMS Revision Snapshots (supports Restore to Draft)
CREATE TABLE cms_revisions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  section_key VARCHAR(64) NOT NULL,
  version_number INT UNSIGNED NOT NULL,
  summary VARCHAR(255) NOT NULL,
  snapshot_json JSON NOT NULL,
  published_by VARCHAR(150) NOT NULL,
  published_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_rev_section (section_key, version_number DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Cloud-hosted Media Library Metadata (NEVER store file blobs in MySQL)
CREATE TABLE media_assets (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  file_name VARCHAR(255) NOT NULL,
  url VARCHAR(1000) NOT NULL,
  storage_provider ENUM('cloudinary','s3','local_asset') NOT NULL DEFAULT 's3',
  mime_type VARCHAR(100) NOT NULL,
  size_bytes INT UNSIGNED NOT NULL DEFAULT 0,
  alt_text_en VARCHAR(255) NOT NULL DEFAULT '',
  alt_text_bn VARCHAR(255) NOT NULL DEFAULT '',
  tags_json JSON NULL,
  uploaded_by VARCHAR(150) NOT NULL,
  uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Platform Operational Controls & RBAC Overrides
CREATE TABLE platform_settings (
  setting_key VARCHAR(100) NOT NULL PRIMARY KEY,
  setting_value JSON NOT NULL,
  updated_by VARCHAR(150) NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 3. Proposed Backend REST Endpoints (`/api/admin/*` & `/api/cms/*`)

All `/admin-panel/src/services/*.ts` files share one Axios instance (`src/services/api.ts`) configured with:
- `baseURL = import.meta.env.VITE_API_BASE_URL` (default `http://localhost:3000/api`)
- `Authorization: Bearer <pathway_admin_jwt_token>` request interceptor
- `401` auto-token clear interceptor

### 3.1 Authentication & RBAC Middleware
Extend `/backend/src/middleware/authMiddleware.js` so `protect` attaches `admin_subrole` and a new `requirePermission(permissionKey)` middleware enforces the RBAC matrix:
- `dashboard:view`, `users:view`, `users:manage`, `users:view_recovery`
- `doctors:view`, `doctors:approve`
- `appointments:view`, `appointments:manage`
- `analytics:view`, `logs:view`, `settings:manage`
- `cms:view`, `cms:edit`, `cms:publish`, `media:manage`

### 3.2 Application Management Endpoints

| Service File | Method & Path | Permission | Purpose |
| :--- | :--- | :--- | :--- |
| `dashboardService` | `GET /api/admin/dashboard/summary` | `dashboard:view` | KPI totals (total users, active users, pending doctors, total appointments) + previous-period growth % + latest activity logs |
| `dashboardService` | `GET /api/admin/dashboard/growth?timeframe=daily\|weekly\|monthly\|yearly` | `dashboard:view` | Current vs. previous period registration series |
| `userService` | `GET /api/admin/users?search=&status=&page=&pageSize=` | `users:view` | Search by name/email/ID, status filter, pagination |
| `userService` | `GET /api/admin/users/:id` | `users:view` | Basic user profile & registration info (strips recovery fields unless authorized + consented) |
| `userService` | `POST /api/admin/users/:id/recovery-access` | `users:view_recovery` | Requires `{ purpose }` (`>= 8` chars) + `share_recovery_with_admin = 1`; logs immutable audit event and returns consented goals/progress |
| `userService` | `PATCH /api/admin/users/:id/status` | `users:manage` | Updates `account_status` + `is_active` and appends `admin_activity_logs` |
| `doctorService` | `GET /api/admin/doctors?status=&search=` | `doctors:view` | Lists all/pending/approved/rejected doctors + counts |
| `doctorService` | `GET /api/admin/doctors/:id` | `doctors:view` | Full credential profile, availability slots, and appointment history |
| `doctorService` | `PATCH /api/admin/doctors/:id/review` | `doctors:approve` | Sets `approval_status` (`approved\|rejected`), `review_notes`, `reviewed_by`, logs activity |
| `appointmentService` | `GET /api/admin/appointments?status=&mode=&search=&page=&pageSize=` | `appointments:view` | Paginated appointments joined with patient/doctor/payment; masks `concerns` when `consent_to_share_data = 0` |
| `appointmentService` | `PATCH /api/admin/appointments/:id/status` | `appointments:manage` | Updates appointment status (`pending\|confirmed\|completed\|cancelled\|rejected`) |
| `analyticsService` | `GET /api/admin/analytics/overview` | `analytics:view` | Real MySQL aggregates (status breakdown, specialty demand, appointment modes, revenue) separated from extended product telemetry |
| `activityService` | `GET /api/admin/activity-logs?category=&search=` | `logs:view` | Filterable audit & platform event stream |
| `settingsService` | `GET /api/admin/settings`, `PUT /api/admin/settings` | `settings:manage` | Operational controls & RBAC permission persistence |

### 3.3 Website CMS & Media Endpoints

| Service File | Method & Path | Permission | Purpose |
| :--- | :--- | :--- | :--- |
| `contentService` | `GET /api/cms/sections` | `cms:view` | Returns `{ draft, published, hasUnpublishedChanges, lastSavedDraftAt, lastPublishedAt }` for all CMS sections |
| `contentService` | `PUT /api/cms/sections/:sectionKey/draft` | `cms:edit` | Saves draft JSON only (never alters `published_json`) |
| `contentService` | `POST /api/cms/sections/:sectionKey/publish` | `cms:publish` | Promotes `draft_json -> published_json`, inserts row in `cms_revisions`, logs audit entry |
| `contentService` | `POST /api/cms/sections/:sectionKey/discard` | `cms:edit` | Resets `draft_json` back to `published_json` |
| `contentService` | `GET /api/cms/revisions?section=` | `cms:view` | Lists historical snapshots for Restore-to-Draft |
| `mediaService` | `POST /api/cms/media/presign` | `media:manage` | Generates S3/Cloudinary upload signature; frontend uploads binary directly to object storage |
| `mediaService` | `POST /api/cms/media`, `GET /api/cms/media`, `DELETE /api/cms/media/:id` | `media:manage` | Persists CDN URL, alt text (EN/BN), and tags in `media_assets` |
| Public Website | `GET /api/cms/public/bundle` | **Public (No Auth)** | Returns **only `published_json`** payloads (`homepage`, `navigation`, `about`, `contact`, `faqs`, `articles` where `status='published'`, `footer`, `seo`) with `ETag` + `Cache-Control: public, max-age=60, stale-while-revalidate=300` |

---

## 4. Connecting the Public Website (`/frontend/`) Later

When ready to make `/frontend/` dynamic:
1. Add a lightweight `useCmsBundle()` loader in `/frontend/src/services/cms.ts` that calls `GET /api/cms/public/bundle` on startup and caches it in memory/`sessionStorage`.
2. Pass published sections to `Home.tsx`, `Header.tsx`, `Footer.tsx`, `About.tsx`, `Contact.tsx`, `Faq.tsx`, `Library.tsx`, and document `<head>` SEO metadata based on active language (`en` vs `bn`).
3. Keep static JSON/i18n defaults as an automatic fallback if the CMS bundle endpoint is unreachable, ensuring zero downtime for patients.

---

## 5. CORS, Security & Deployment Architecture

### Recommended Production Topology
- **Public Pathway Website (`/frontend`)**: Vercel / Netlify static SPA (`https://pathway.example.com`)
- **Pathway Admin CMS (`/admin-panel`)**: Separate Vercel / Netlify static SPA (`https://admin.pathway.example.com`), protected by admin authentication + optional IP/VPN or Cloudflare Access restriction
- **Express Backend (`/backend`)**: Render / Railway / Cloud Run (`https://api.pathway.example.com`)
- **Database**: Managed MySQL 8 (Cloud SQL / Aiven / Railway MySQL)
- **Media Storage**: AWS S3 + CloudFront, Cloudflare R2, or Cloudinary

### CORS Configuration Update (`/backend/src/server.js`)
Add `ADMIN_PANEL_URL` (e.g., `https://admin.pathway.example.com` and `http://localhost:3001`) to `allowedOrigins` in `/backend/src/server.js` when enabling live mode.

### Cutover Checklist (`VITE_USE_MOCK=false`)
1. Apply the MySQL schema additions from Section 2 and seed an initial `super_admin` user (`role='admin'`, `admin_subrole='super_admin'`).
2. Implement the `/api/admin/*` and `/api/cms/*` Express controllers with `protect` + `requirePermission(...)`.
3. Configure `/admin-panel/.env` with `VITE_API_BASE_URL=https://api.pathway.example.com/api`, `VITE_PUBLIC_SITE_URL=https://pathway.example.com`, and `VITE_USE_MOCK=false`.
4. Replace `AdminAuthContext` demo sign-in with `POST /api/auth/login` (verifying `user.role === 'admin'`).
