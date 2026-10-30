# ✨ Gather & Glow — GenAI Event Planning Platform

[![Vite](https://img.shields.io/badge/Vite-v8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-v19.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v7.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vitest](https://img.shields.io/badge/Tests-40%2B%20Passing-22c55e?logo=vitest&logoColor=white)](https://vitest.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.3-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Groq Cloud](https://img.shields.io/badge/AI-Groq_Cloud-F55036?logo=fastapi&logoColor=white)](https://groq.com/)
[![Supabase](https://img.shields.io/badge/Database-Supabase_PostgreSQL-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)

> **Theme / Core Mission:**  
> **"Create a GenAI-powered planning assistant that helps users organize weddings, birthdays, and community events with budgets, timelines, vendor checklists, and personalized ideas."**

---

## 🎯 Problem Statement Alignment Matrix

| Pillar | Required Capability | Implementation in Gather & Glow | Verification Test |
| :--- | :--- | :--- | :--- |
| **1. Event Categories** | Organize **Weddings**, **Birthdays**, & **Community Events** | Dedicated ceremony workflows, milestone birthday parties, and civic festival permit tracking | `problemStatement.test.ts` (Pillar 1) |
| **2. Dynamic Budgets** | Calculate allocations, cost-savings & financial ledger | Category allocation breakdown, spending charts, threshold warnings, and expense tracking | `problemStatement.test.ts` (Pillar 2) & `aiService.test.ts` |
| **3. Timelines & Schedules** | Master cue sheet & minute-by-minute schedule | Day-of run of show schedule generation with responsible party tags and milestone cues | `problemStatement.test.ts` (Pillar 3) |
| **4. Vendor Checklists** | Vendor contract tracking & milestone checklists | Multi-phase vendor checklists (6-month countdown to event week) + quoted vs. agreed price tracker | `problemStatement.test.ts` (Pillar 4) |
| **5. Personalized Ideas** | Bespoke aesthetic themes, palettes, and invitations | Tailored color palettes with hex codes, atmosphere staging notes, and letterpress/digital invitation drafts | `problemStatement.test.ts` (Pillar 5) |

---

## 🌟 Key Features & Capabilities

### 1. 🤖 GenAI Planning Assistant (`/ai-assistant`)
* **Dual Inference Pipeline**:
  * **Live Groq Cloud**: Ultra-fast LLM inference (`openai/gpt-oss-120b`) via API key.
  * **Studio Simulation Engine**: Deterministic fallback providing rich, production-grade recommendations offline.
* **1-Click "Save to Event"**: Automatically injects AI-generated tasks, budget allocations, run of show schedules, or theme notes directly into the event workspace.

### 2. 💍 Event Category Workflows
* **Weddings**: Vow exchange timing, floral compotes, seating plans, rehearsal dinners, and formal letterpress stationery.
* **Birthdays**: Rooftop lounge themes, DJ and cocktail curation, cake reveals, and invitation copy.
* **Community Events**: Municipal park permits, sound bylaws, volunteer committee shift tracking, and staging schedules.

### 3. 💰 Budget Ledger & Allocations (`/budget`)
* **Real-Time Financial Dashboard**: Total Budget, Estimated Cost, Actual Spent, and Remaining Reserve.
* **Over-Budget Warning System**: Proactive banner alert triggered at 85% expenditure.
* **Interactive Recharts**: Category breakdown visualizations and expenditure variances.

### 4. ⏱️ Timeline & Task Management (`/timeline`, `/tasks`)
* **Day-of Run of Show**: Chronological cue sheet with vendor assignments.
* **Kanban & List Views**: Task tracking across *Pending*, *In Progress*, and *Completed* stages.

### 5. 🤝 Vendor Checklists & Contract Tracking (`/vendors`)
* Tracks quotations, agreed contract prices, deposit dates, and payment balances across 10+ categories.

### 6. 🔒 Enterprise Security & Privacy
* **HTTP Security Headers**: Strict CSP, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `HSTS`, and `Referrer-Policy: strict-origin-when-cross-origin` in `vercel.json`.
* **Zero Secret Exposure**: `.env` is excluded and untracked; client uses safe public proxies or optional simulation mode.
* **Supabase PostgreSQL RLS**: Row Level Security policies with cascading referential integrity.

### 7. ♿ Accessibility (WCAG 2.1 AA)
* Accessible modal dialogs (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`).
* Live regions (`role="log"`, `aria-live="polite"`) for real-time AI generation.
* Form controls with `aria-invalid` and `aria-describedby` error associations.
* Skip to main content navigation link for screen readers and keyboard users.

---

## 🧪 Automated Testing Suite

Run the full Vitest suite:
```bash
npm test
```

### Test Coverage Highlights:
- **`problemStatement.test.ts`**: Verifies all 5 pillars (Weddings, Birthdays, Community Events, Budgets, Timelines, Vendor Checklists, Personalized Ideas).
- **`aiService.test.ts`**: Validates prompt generation, fallback resilience, invitation copy, and budget calculations.
- **`eventService.test.ts`**: Validates event retrieval, filtering, aggregations, and statistics calculation.
- **`hooks.test.ts`**: Verifies local storage persistence and state sync.
- **`supabaseClient.test.ts`**: Tests bi-directional snake_case $\leftrightarrow$ camelCase mappers.
- **`format.test.ts`**: Validates currency, date, and time formatting.
- **`components.test.tsx`**: Validates accessible component rendering.

---

## 🛠️ Tech Stack

* **Frontend**: React 19 + TypeScript
* **Build**: Vite 8 (Route code-splitting via `React.lazy`)
* **Styling**: Tailwind CSS v4 + Motion
* **Visualizations**: Recharts
* **Icons**: Lucide React
* **AI Provider**: Groq Cloud (`openai/gpt-oss-120b`) / Studio Simulation
* **Database**: Supabase PostgreSQL 15
* **Testing**: Vitest + Testing Library + JSDOM
* **Linter**: Oxlint (0 errors, 0 warnings)

---

## 🚀 Getting Started

```bash
# 1. Clone & install
git clone https://github.com/BudarajuJaswanth/hack_2_Skill_5.git
cd hack_2_Skill_5
npm install

# 2. Run automated tests
npm test

# 3. Check code quality / linter
npm run lint

# 4. Start local development
npm run dev

# 5. Build for production
npm run build
```

---

## 📄 License
This project is open-source under the MIT License.
