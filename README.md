# 🌩️ Capacity Connect

> **Digital Capacity Building and Learning Management Portal for the India Meteorological Department (IMD)**
>
> *Smart India Hackathon 2026 - Problem Statement SIH26075 (Ministry of Earth Sciences)*

![Capacity Connect Preview](https://via.placeholder.com/1200x600/1e3a5f/ffffff?text=Capacity+Connect+Dashboard)

## 🌟 The Vision

**Capacity Connect** is a centralized, state-of-the-art web portal designed exclusively for the personnel of the India Meteorological Department. It brings together people, content, and tracking under one unified roof to foster a culture of continuous learning and digital empowerment.

Our goal is to modernize the way IMD staff train, share knowledge, and build competencies—transitioning from scattered documents and offline seminars to a rich, interactive, and trackable digital learning ecosystem synced with the iGOT Karmayogi philosophy.

---

## 🚀 Key Features (The "Wow" Factor)

- **🧭 Role-Based Dashboards:** Distinct, intuitive experiences for Trainees, Trainers, and Administrators.
- **📚 Rich Course Catalog:** Multimedia learning including interactive videos, presentations, and PDFs.
- **✅ Competency & Assessments:** Rigorous MCQ assessments with automated scoring and instant feedback.
- **🏆 Digital Passport:** Verifiable certification records and comprehensive skill matrices for every employee.
- **🔍 Intelligent Trainer Finder:** Connect with experts across IMD based on exact competencies and proficiency levels.
- **📊 Real-time Analytics:** Deep insights for administrators into learning trends, completion rates, and platform engagement.

---

## 🛠️ Technology Stack

We built Capacity Connect with modern, scalable, and robust technologies:

- **Frontend Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (Strict Mode)
- **Styling:** Tailwind CSS v4 + Custom CSS Variables for a seamless light/dark mode experience.
- **State Management:** Zustand
- **Icons:** Lucide React
- **Forms & Validation:** React Hook Form + Zod
- **Database (Demo):** In-memory Zustand persist store (Migrating to **Supabase** for production)
- **File Storage (Demo):** IndexedDB (Migrating to Cloud Storage)

---

## 🎨 Design Philosophy

Our design aesthetic is built on **trust, clarity, and modernity**:
- **Trustworthy Colors:** Deep Navy (`#1e3a5f`), Sky Blue (`#5b9bd5`), and Saffron (`#e8943a`) reflect the gravity of earth sciences and the Indian government.
- **Fluid Micro-animations:** 150-250ms smooth transitions make the interface feel alive and highly responsive.
- **Soft Geometry:** `rounded-2xl` cards and subtle layered shadows reduce cognitive load and create a premium feel.
- **Accessibility First:** High contrast ratios, focus rings (`focus-visible`), and semantic HTML ensure the platform is usable by everyone.

---

## 📂 Project Structure

```text
boxy/
├── src/
│   ├── app/                 # Next.js App Router pages & layouts
│   │   ├── (public)/        # Login, Signup, Homepage
│   │   ├── (trainee)/       # Trainee dashboard, courses, assessments
│   │   ├── (trainer)/       # Trainer dashboard, library, questionnaires
│   │   └── (admin)/         # Admin dashboard, user management
│   ├── components/          # Reusable UI components
│   │   └── shared/          # Buttons, Cards, Modals, Navbars
│   ├── lib/                 # Business logic & utilities
│   │   ├── db/              # Stage 1: Demo Database & Repositories
│   │   ├── services/        # Service layer (auth, courses, users)
│   │   └── types.ts         # Global TypeScript definitions
│   └── store/               # Zustand state management
├── docs/                    # Detailed technical documentation
└── public/                  # Static assets
```

---

## ⚙️ Getting Started (Development)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/snowdencubes/boxy.git
   cd boxy
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📖 Documentation

For detailed technical insights, please refer to our `docs/` folder:
- [Architecture Blueprint](./docs/ARCHITECTURE.md)
- [Data Model & Schema](./docs/DATA_MODEL.md)
- [Service Layer API](./docs/SERVICES.md)
- [Business Assumptions](./docs/ASSUMPTIONS.md)
- [SIH Presentation Demo Script](./docs/DEMO_SCRIPT.md)

---

## 🤝 Contribution Guidelines

Please read our comprehensive [Contributing Guide](./docs/CONTRIBUTING.md) before making any PRs. All contributions for SIH26075 should be pushed through authorized accounts. Ensure you follow the strict TypeScript guidelines and run `npm run lint` before committing.

*Built with ❤️ for the Ministry of Earth Sciences, Govt. of India.*
