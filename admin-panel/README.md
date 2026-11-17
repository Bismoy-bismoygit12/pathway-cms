# Pathway Admin CMS

Dedicated **Application Management** and **Bilingual Website Content Management System (CMS)** for the **Pathway** mental health & recovery platform.

Built as an independent React + TypeScript + Vite application inside `/admin-panel/` while keeping `/frontend/` (public Pathway website) and `/backend/` (Express + MySQL API) completely untouched.

---

## Key Capabilities

### 1. Application Management
- **Main Dashboard**: KPI cards (Total Registered Users, Active Users, Pending Doctor Approvals, Total Appointments) with previous-period growth comparisons, quick links, interactive **User Growth Analytics** (`Daily`, `Weekly`, `Monthly`, `Yearly`), and Recent Activities feed.
- **User Management**: Search by name, nickname, email, or user ID; filter by account status (`active`, `paused`, `locked`, `pending_deletion`, `inactive`); pagination; status controls; and **permission- & consent-gated** sensitive recovery profile inspection with mandatory access-purpose audit logging.
- **Doctor Management**: Tabs for All, Pending Approvals, Approved, and Rejected applications; BMDC credential inspection; approve/reject workflow with mandatory rejection rationale; availability slots; and appointment history.
- **Appointment Management**: Total/filterable directory by status and consultation mode (`online` / `in_person`), pagination, status management, payment status tracking, and consent-gated patient concerns.
- **Platform Analytics**: Revenue, session completion, specialty demand, and engagement charts clearly separating MySQL-backed aggregates from extended telemetry.
- **Activity & Audit Logs**: Real-time filterable ledger covering user registrations, doctor reviews, status changes, sensitive access audits, and CMS publishes.
- **Admin Settings & RBAC**: Live **Role-Based Access Control** matrix (`Super Admin`, `Admin`, `Content Manager`, `Doctor Manager`) + operational platform controls.

### 2. Website CMS (Bilingual EN + বাংলা)
- **Strict Editorial Workflow**: Every CMS module enforces **Edit Draft -> Save Draft -> Visual Preview -> Publish Live** (never auto-publishes), plus **Discard Draft** and **Versioned Revision History (Restore to Draft)**.
- **Multi-Viewport Visual Preview**: Inspect Draft vs. Published Live side-by-side across **Desktop**, **Tablet (`768px`)**, and **Mobile (`375px`)** in both **English** and **বাংলা**.
- **9 CMS Modules**:
  - Homepage Editor (hero copy, pharmaceutical/wellness carousel slides, feature pillars, metrics banner, bottom CTA)
  - Navigation Menu & Announcement Bar
  - About Us Page & Philosophy Pillars
  - Contact Page, Helpline & Office Hours
  - FAQ Manager (categorized, bilingual, reorderable)
  - Blog & Educational Articles Manager (draft/published workflow synced with Library content)
  - Media Library (cloud-storage-ready URL & metadata management, reusable picker modal)
  - Footer Editor (crisis CTA banner, 3 columns, copyright & disclaimer)
  - SEO & Metadata Manager (titles, meta descriptions, OG tags, SERP & social card preview)

---

## Tech Stack

- **React 19** + **TypeScript 5.8**
- **Vite 6** (with vendor chunk splitting)
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- **React Router v7**
- **Recharts** (analytics charts)
- **Lucide React** (icons)
- **Axios** (API client with JWT & 401 interceptors)

---

## Directory Structure

```text
admin-panel/
├── docs/
│   └── BACKEND_INTEGRATION.md   # MySQL schema additions, REST contracts & cutover guide
├── public/
├── src/
│   ├── components/
│   │   ├── cms/                 # BilingualField, MediaPickerModal, PublishToolbar, SitePreviewModal
│   │   ├── common/              # StatusBadges, ModulePlaceholder
│   │   ├── layout/              # AdminLayout, Sidebar, Topbar
│   │   └── ui/                  # Button, Card, Badge, Input, Modal, Switch, Tabs, Toast
│   ├── context/
│   │   ├── AdminAuthContext.tsx # RBAC role state, permissions, demo auth
│   │   └── CmsContext.tsx       # Draft/Published state, revisions, preview modal
│   ├── data/
│   │   ├── mockPlatformData.ts  # Demo users, doctors, appointments, logs, growth metrics
│   │   ├── mockCmsData.ts       # Seeded bilingual content matching public Pathway pages
│   │   └── mockStore.ts         # Session-synced mutable demo store
│   ├── lib/utils.ts             # Formatting & class-name helpers
│   ├── pages/
│   │   ├── website/             # All 9 CMS editor pages
│   │   └── *.tsx                # Dashboard, Users, UserDetail, Doctors, DoctorDetail, Appointments, Analytics, ActivityLogs, Settings, Login
│   ├── services/                # Axios-ready service modules with VITE_USE_MOCK switch
│   └── types/                   # TypeScript interfaces for Platform & CMS domains
├── .env.example
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Getting Started

> **Workspace Note:** The root repository uses Bun workspaces for `frontend` and `backend`. Keep `/admin-panel/` isolated by running commands with `yarn --cwd admin-panel ...` (or inside `cd admin-panel`).

### 1. Environment Variables
Copy `.env.example` to `.env`:

```bash
cp admin-panel/.env.example admin-panel/.env
```

| Variable | Default | Description |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | `http://localhost:3000/api` | Express backend API base URL |
| `VITE_PUBLIC_SITE_URL` | `http://localhost:3000` | Public Pathway website URL for topbar quick-link |
| `VITE_USE_MOCK` | `true` | `true` for interactive demo data; `false` when live `/api/admin/*` and `/api/cms/*` endpoints are deployed |

### 2. Install & Run

```bash
# Install isolated dependencies inside admin-panel/
yarn --cwd admin-panel install

# Start development server (http://localhost:3001)
yarn --cwd admin-panel dev

# TypeScript lint check
yarn --cwd admin-panel lint

# Production build (outputs to admin-panel/dist/)
yarn --cwd admin-panel build

# Preview production build
yarn --cwd admin-panel preview
```

---

## Demo Accounts & RBAC Testing

On the Login screen (`/login`), use any preset demo profile or test credentials, or switch roles on the fly using the **Test Role** dropdown in the Topbar:

| Role | Access Scope |
| :--- | :--- |
| **Super Admin** | Full platform management, doctor approvals, sensitive recovery access, CMS edit & publish, RBAC settings |
| **Admin** | Platform operations (users, doctors, appointments, analytics, logs, CMS edit & publish), excludes RBAC settings |
| **Content Manager** | Full Website CMS access (draft, preview, publish, media library), read-only dashboard |
| **Doctor Manager** | Doctor credential review & approvals, appointments visibility, user status support |

---

## Backend Integration & Deployment

See [`docs/BACKEND_INTEGRATION.md`](./docs/BACKEND_INTEGRATION.md) for:
- Mapping to existing MySQL tables (`users`, `doctor_profiles`, `appointments`, `payments`, `user_goals`, `medical_reports`)
- Required MySQL migrations for `cms_sections`, `cms_revisions`, `media_assets`, and `admin_activity_logs`
- Complete `/api/admin/*` and `/api/cms/*` REST endpoint contracts
- Public website integration (`GET /api/cms/public/bundle`) and production deployment checklist
