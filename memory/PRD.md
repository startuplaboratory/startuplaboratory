# Execution Blueprint - Product Requirements Document

## Project Overview
**Execution Blueprint** is a desktop-first responsive web app that converts raw startup ideas into structured, directed 30-day execution blueprints using a data-driven scoring framework.

## Architecture

### Tech Stack
- **Frontend**: React + Tailwind CSS + Shadcn/UI
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **AI Integration**: OpenAI GPT-5.2 via Emergent LLM Key (for personalized insights)
- **Authentication**: JWT-based email/password auth

### Data Models
- **User**: id, email, password, full_name, plan_type, credits, total_submissions
- **Submission**: id, user_id, idea_title, problem_statement, geography, 20 answer fields, status
- **Score**: id, submission_id, 6 pillar scores, total_score, risk_tier, execution_mode, warnings
- **BlueprintRequest**: Custom blueprint applications
- **ExpertNote**: Admin notes for submissions
- **CreditLog**: Credit usage tracking

## Core Features Implemented

### 1. Landing Page
- Hero section with "Start Your Analysis" CTA
- How it Works section
- Six Pillars Framework explanation
- Risk Tiers/Execution Modes explanation
- Secondary CTA for Custom Blueprint

### 2. Authentication
- Email/password signup with 1 free credit
- JWT-based login
- Protected routes for dashboard/submissions/results

### 3. Dashboard
- Credits remaining display
- Submission history with status
- Quick submit new idea button

### 4. 20-Question Submission Form
- Step-by-step wizard interface
- 6 pillars: Market Demand, Competition, Scalability, Founder Fit, Capital, Execution
- Progress indicator
- Validation at each step

### 5. Scoring Engine
- Exact formula implementation per spec
- Pillar weights: Market(20), Competition(15), Scalability(15), Founder Fit(20), Capital(15), Execution(15)
- Risk tier thresholds: ≥80 Strong Proceed, 65-79 Conditional Proceed, 50-64 Validation Required, <50 Elevated Risk
- Warning flags when pillar <40%

### 6. Results Page (5 Sections)
1. **Decision Snapshot**: Total score, risk tier, execution mode, verdict
2. **Structural Analysis**: 6 pillar bars, strength/weakness, warnings
3. **Strategic Interpretation**: Conditional statements, priority actions (AI-personalized)
4. **30-Day Action Plan**: Week-by-week template based on execution mode
5. **Precision Upgrade Layer**: Custom Blueprint CTA

### 7. Custom Blueprint Application
- Structured form with auto-fill from submission
- Budget band, timeline, commitment fields
- Status tracking

### 8. Admin Panel
- View all submissions and users
- Edit scores and add expert adjustments
- Add expert notes
- Manage user credits
- Update submission status
- View blueprint requests and credit logs

## User Personas
1. **First-time Founder**: Validating initial idea, needs structured framework
2. **Serial Entrepreneur**: Quick assessment of multiple ideas
3. **Side-Project Builder**: Limited time, needs clear action plan

## What's Been Implemented (March 2026)
- ✅ Full authentication flow
- ✅ 20-question submission form
- ✅ Scoring engine with exact formula
- ✅ Warning layer with 4 warning types
- ✅ 30-day templates for all 4 execution modes
- ✅ AI-personalized insights (3 lines)
- ✅ Admin panel with score editing
- ✅ Credit system with deduction
- ✅ Results page with all 5 sections
- ✅ Custom blueprint application form

## Remaining Backlog

### P0 (Critical)
- None - core functionality complete

### P1 (High Priority)
- PDF export for blueprints
- Email notifications for blueprint applications
- Re-score workflow (paid feature)

### P2 (Medium Priority)
- Paid plan integration (Stripe)
- CSV export for admin
- PDF upload for custom blueprints

### P3 (Low Priority)
- Password reset
- Email verification
- Dark mode

## API Endpoints
- POST /api/auth/signup
- POST /api/auth/login
- GET /api/auth/me
- POST /api/submissions
- GET /api/submissions
- GET /api/submissions/:id
- POST /api/submissions/:id/generate-score
- GET /api/submissions/:id/score
- GET /api/submissions/:id/blueprint
- POST /api/blueprint-requests
- Admin endpoints: /api/admin/*

## Admin Credentials
- Email: admin@executionblueprint.com
- Password: admin123

## Next Steps
1. Implement PDF export functionality
2. Add email notification integration
3. Integrate Stripe for paid plans
