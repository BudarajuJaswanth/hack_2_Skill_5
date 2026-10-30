# ✨ Gather & Glow — Luxury Event Management & GenAI Planning Platform

[![Vite](https://img.shields.io/badge/Vite-v8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-v19.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v7.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.3-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Groq Cloud](https://img.shields.io/badge/AI-Groq_Cloud-F55036?logo=fastapi&logoColor=white)](https://groq.com/)
[![Supabase](https://img.shields.io/badge/Database-Supabase_PostgreSQL-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)

> **"Every Celebration Starts With a Beautiful Plan."**
> A modern luxury event management SaaS platform and GenAI-powered planning architect crafted to help organizers plan **Weddings**, **Birthdays**, and **Community Festivals** with dynamic budgets, precision timelines, vendor checklists, and personalized aesthetic ideas.

---

## 🌟 Key Features & Capabilities

### 1. 🤖 GenAI-Powered Planning Assistant (`/ai-assistant`)
* **Real-Time Live Inference**: Connected to Groq Cloud running `openai/gpt-oss-120b` with sub-second response times.
* **Studio Simulation Fallback**: High-fidelity offline intelligence engine for zero-configuration demo operation.
* **10 Planning Directives**:
  1. Luxury themes & color palettes with exact hex codes and tactile textures.
  2. Architectural floral staging, compotes, and ambient 2200K festoon lighting.
  3. Dynamic line-item budget allocation breakdowns.
  4. Multi-phase milestone countdown checklists (from 6 months out to event week).
  5. Precision minute-by-minute day-of runs of show.
  6. Farm-to-table culinary menus, cocktail mixology, and dietary care (vegan, gluten-free, allergy care).
  7. Tiered vendor enlistment priorities.
  8. Strategic cost-saving proposals ($5,000+ potential savings).
  9. Formal letterpress, contemporary digital RSVP, and civic flyer invitation wording.
  10. Context-aware advice synced to your active celebration parameters.
* **1-Click "Save to Event"**: Automatically imports AI recommendations into your live **Tasks**, **Budget Ledger**, **Timeline Schedule**, or **Event Theme**.

### 2. 💍 Tailored Celebration Workflows
* **Weddings**: Ceremony & vow exchange timing, floral arbor staging, bridal suite logistics, classical string quartets, and letterpress invitation suites.
* **Birthdays**: Rooftop penthouses, curated DJ playlists, craft mixology, multi-tiered cake reveals with bottle sparklers, and photo moments.
* **Community Events**: Municipal park permits, sound approvals, volunteer committee shifts (30+ leads), artisan food truck coordination, and mainstage audio staging.

### 3. 💰 Comprehensive Budget Planner (`/budget`)
* **Real-Time Financial Metrics**: Total Budget, Estimated Cost, Actual Spent, and Remaining Reserve.
* **Over-Budget Warning System**: Proactive alert banner triggered when spending exceeds 85% of budget.
* **Interactive Recharts Visualizations**: Category breakdown charts and estimated vs. actual variance tracking.
* **Line-Item Ledger**: Full CRUD expense management with *Paid* / *Pending* toggles.

### 4. ⏱️ Timeline & Task Management (`/timeline`, `/tasks`)
* **Day-of Master Cue Sheet**: Chronological run-of-show cue sheets with responsible supplier markers.
* **Multi-View Task Manager**:
  * **Kanban Board**: Drag-and-drop / click-to-move across *Pending*, *In Progress*, and *Completed*.
  * **List View**: Filterable task table with priority badges and overdue warnings.
  * **Calendar View**: Monthly deadline scheduling.

### 5. 🤝 Vendor Directory & Quote Comparison (`/vendors`)
* **10+ Service Categories**: Venue, Catering, Decoration, Photography, Videography, Music, Makeup, Transportation, and Invitations.
* **Quoted vs. Agreed Price**: Compares initial estimates against final negotiated contract figures.
* **Contract & Deposit Tracking**: Signed agreements, deposit milestones, paid amounts, and outstanding balances.

### 6. 👥 Guest Logistics & RSVP Tracking (`/guests`)
* **Real-Time Attendance**: RSVP breakdowns (*Confirmed*, *Declined*, *Pending*, *Invited*).
* **Dietary & Special Requirements**: Tracks vegan, vegetarian, gluten-free, allergies, and mobility accommodations.
* **Plus-One & Table Allocations**: Tracks guest companions, plus-one names, and seating assignments.

### 7. ☁️ Supabase PostgreSQL Cloud Sync (`/settings`)
* **Production Schema Script**: [`supabase/schema.sql`](./supabase/schema.sql) with tables (`events`, `tasks`, `guests`, `budget_items`, `vendors`, `timeline_items`), foreign keys (`ON DELETE CASCADE`), indexes, and Row Level Security (RLS) policies.
* **Bidirectional Sync**: Real-time optimistic UI with automatic cloud synchronization and local cache fallback.

---

## 🛠️ Tech Stack & Architecture

* **Frontend Framework**: React 19 + TypeScript
* **Build System**: Vite 8
* **Styling**: Tailwind CSS v4 + Motion for React
* **Data Visualizations**: Recharts
* **Icons**: Lucide React
* **AI Provider**: Groq Cloud (`openai/gpt-oss-120b`)
* **Database & Cloud**: Supabase (PostgreSQL 15 via PostgREST)
* **Code Quality**: Oxlint (0 errors, 0 warnings)

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/BudarajuJaswanth/hack_2_Skill_5.git
cd hack_2_Skill_5
npm install
```

### 2. Configure Environment Variables
Copy the example environment configuration:
```bash
cp .env.example .env
```
Configure your environment variables in `.env`:
```env
VITE_APP_TITLE="Gather & Glow | Luxury Event Planning Atelier"

# AI Provider: 'demo' (offline simulation) | 'groq' (live inference)
VITE_AI_PROVIDER=groq
VITE_GROQ_API_KEY="your-groq-api-key"
VITE_GROQ_MODEL="openai/gpt-oss-120b"

# Optional: Supabase PostgreSQL Persistence
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

### 3. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
npm run build
npm run preview
```

---

## 🗄️ Database Setup (Supabase)

To initialize your cloud database tables:
1. Open your [Supabase Dashboard SQL Editor](https://supabase.com/dashboard/project/_/sql).
2. Copy and paste the contents of [`supabase/schema.sql`](./supabase/schema.sql).
3. Click **Run**.
4. In Gather & Glow, go to **Settings** (`/settings`) and click **"Test Connection"** to verify.

---

## 📄 License
This project is open-source under the MIT License.
