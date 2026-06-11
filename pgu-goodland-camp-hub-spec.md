# PGU 2026 Tour Hub — Goodland Camp Stop

## Overview

A React web app serving as the operational hub for Point Guard University's 2026 Summer Camp Tour, starting with the Goodland, KS camp stop. This is a single-stop build (Phase 1). Future phases will add Limon, Marion, and South Bend stops, plus a cross-stop dashboard.

The app replaces a static PDF/Google Sheet tracking system with a live, interactive CRM for managing coaches, sponsors, volunteers, day-of operations, contacts, and notes for a 4-day basketball camp.

**Tech Stack:** Vite + React + Tailwind CSS
**Data Storage:** Browser localStorage (solo user, v1)
**Design Direction:** Clean, modern dashboard. PGU brand colors (orange and black). Readable, not flashy.

---

## Data Models

### 1. Coaching Schedule

A grid showing Monday through Thursday with **7 coach slots per day** (28 total slots for Goodland).

Each slot has:
- `id` (auto-generated)
- `day` — Monday | Tuesday | Wednesday | Thursday
- `slotNumber` — 1 through 7
- `coachName` — string (empty if unfilled)
- `contactInfo` — string (phone or email)
- `status` — Confirmed | Need | N/A

**Pre-loaded Goodland Data (seed on first run):**

| Day | Slot | Coach | Contact | Status |
|-----|------|-------|---------|--------|
| Monday | 1 | | | Need |
| Monday | 2 | | | Need |
| Monday | 3 | | | Need |
| Monday | 4 | | | Need |
| Monday | 5 | | | Need |
| Monday | 6 | | | Need |
| Monday | 7 | | | Need |
| Tuesday | 1 | | | Need |
| Tuesday | 2 | | | Need |
| Tuesday | 3 | | | Need |
| Tuesday | 4 | | | Need |
| Tuesday | 5 | | | Need |
| Tuesday | 6 | | | Need |
| Tuesday | 7 | | | Need |
| Wednesday | 1 | | | Need |
| Wednesday | 2 | | | Need |
| Wednesday | 3 | | | Need |
| Wednesday | 4 | | | Need |
| Wednesday | 5 | | | Need |
| Wednesday | 6 | | | Need |
| Wednesday | 7 | | | Need |
| Thursday | 1 | | | Need |
| Thursday | 2 | | | Need |
| Thursday | 3 | | | Need |
| Thursday | 4 | | | Need |
| Thursday | 5 | | | Need |
| Thursday | 6 | | | Need |
| Thursday | 7 | | | Need |

**UI Notes:**
- Display as a 4-column grid (one column per day)
- Each column shows 7 rows (slots)
- Empty/Need slots should be visually distinct (light red or orange background)
- Confirmed slots show green background
- N/A slots show gray background
- Click a slot to edit: assign a coach name, contact info, change status
- Header of each column shows day name + fill count (e.g., "Monday — 0/7 Filled")

---

### 2. Coach Options (Roster)

A list of available coaches who can be assigned to coaching schedule slots.

Each coach has:
- `id` (auto-generated)
- `name` — string
- `contactInfo` — string (phone or email)
- `notes` — string (optional)

**Pre-loaded Goodland Data:**

| Name | Contact | Notes |
|------|---------|-------|
| Jake Marshall | (515) 988-0690 | |
| Annie Kassongo | (405) 549-7281 | |
| Jerrod Stanford | (620) 385-0273 | |
| Emma Lehman | (785) 821-3295 | |
| Talexa Weeter | (785) 772-7359 | |
| Braydon Summers | (785) 852-1100 | |
| Josh Gooch | (620) 376-8139 | |
| Brandon Gehring | (785) 213-1773 | |

**UI Notes:**
- Simple table with add/edit/delete
- When assigning a coach to a schedule slot, show a dropdown populated from this roster (with option to type a new name)

---

### 3. Key Personnel

Important local contacts for this camp stop (gym contacts, school admin, community partners).

Each person has:
- `id` (auto-generated)
- `name` — string
- `contactInfo` — string (phone, email, or both)
- `role` — string (free text, e.g., "Gym Contact", "School Admin", "Community Partner")
- `notes` — string (optional)

**Pre-loaded Goodland Data:**

| Name | Contact | Role | Notes |
|------|---------|------|-------|
| Marty Lehman | (785) 821-4640 | Key Personnel | |
| Bill Biermann | bill.biermann@usd352.org | Key Personnel | |
| Zach McNall | (785) 821-3785 | Key Personnel | |
| Mikayla Biermann | (785) 821-6121 | Key Personnel | |

---

### 4. Sponsors

Tracking food, lodging, and cash sponsors for the camp stop.

Each sponsor has:
- `id` (auto-generated)
- `sponsorType` — Food | Lodging | Cash
- `sponsorName` — string (empty if unfilled)
- `contactInfo` — string
- `level` — Platinum | Gold | Silver | Bronze (dropdown)
- `status` — Confirmed | Need | N/A
- `notes` — string (optional)

**Pre-loaded Goodland Data:**

| Type | Name | Contact | Level | Status | Notes |
|------|------|---------|-------|--------|-------|
| Food | | | | Need | |
| Lodging | Paul Flanders | | | Need | Last Year: Holiday Inn & Suites |
| Cash | | | | Need | |

**UI Notes:**
- Card or table layout grouped by sponsor type
- Need = red/orange badge, Confirmed = green badge, N/A = gray badge
- Level dropdown appears when status is Confirmed

---

### 5. Gym Fee

- `status` — Confirmed | Need | N/A
- `amount` — string (optional, for dollar amount or "FREE")
- `notes` — string

**Pre-loaded Goodland Data:** Status = Confirmed, Amount = "FREE"

**UI Notes:** Simple card or inline row, not a full table. Just status + amount + notes.

---

### 6. Volunteer Roles

Day-of operational roles that need to be filled.

Each role has:
- `id` (auto-generated)
- `roleName` — string (e.g., Registration Table, Food Runner, Gym Set-Up, Photo/Video)
- `assignedTo` — string (person's name, empty if unfilled)
- `contactInfo` — string
- `status` — Confirmed | Need | N/A

**Pre-loaded Goodland Data:**

| Role | Assigned To | Contact | Status |
|------|-------------|---------|--------|
| Registration Table | | | Need |
| Food Runner | | | Need |
| Gym Set-Up | | | Need |
| Photo/Video | Linda O'Connor | | Confirmed |

**UI Notes:**
- Same visual treatment as sponsors: status badges, click to edit
- Add ability to create custom roles beyond the defaults

---

### 7. Reminders & Notes

A catch-all section for camp-specific notes, to-do items, and day-of operations details.

Each entry has:
- `id` (auto-generated)
- `title` — string (short description)
- `details` — string (longer note, optional)
- `urgency` — Red | Orange | Green (color-coded priority)
- `createdAt` — timestamp
- `completed` — boolean

**Pre-loaded Goodland Data:**

| Title | Details | Urgency |
|-------|---------|---------|
| Schemm Trophy | Thursday @ TBD | Orange |

**UI Notes:**
- Entry form at top: title field, details field, urgency dropdown (Red/Orange/Green), submit button
- List below sorted by urgency (Red first, then Orange, then Green)
- Red = urgent/blocking, Orange = important/upcoming, Green = informational/low priority
- Red items have red left-border or badge, Orange = orange, Green = green
- Checkbox to mark complete (completed items move to bottom, grayed out)
- Click to edit any entry

---

### 8. Contacts (Master List)

A unified contact directory for everyone associated with this camp stop. This pulls together coaches, key personnel, sponsors, and volunteers into one searchable list, plus allows adding standalone contacts.

Each contact has:
- `id` (auto-generated)
- `name` — string
- `contactInfo` — string (phone, email, or both)
- `role` — string (Coach, Key Personnel, Sponsor, Volunteer, Other)
- `organization` — string (optional)
- `notes` — string (optional)

**Pre-loaded:** Auto-populated from all other sections on first run. Any contact added in Coaches, Key Personnel, Sponsors, or Volunteers also appears here. Standalone contacts can be added directly.

**UI Notes:**
- Searchable and filterable by role
- This is the "phone book" for the camp stop

---

## App Layout

### Navigation
- Sidebar or top tabs with sections:
  - **Dashboard** (overview/summary)
  - **Coaching Schedule**
  - **Coach Roster**
  - **Key Personnel**
  - **Sponsors**
  - **Volunteer Roles**
  - **Reminders & Notes**
  - **Contacts**

### Dashboard View
The landing page. Shows at-a-glance status for the Goodland stop:
- **Coaching Schedule Summary:** "X/28 Coaching Slots Filled" with a mini visual (4 progress bars, one per day)
- **Sponsor Status:** Quick cards showing Food (Need/Confirmed), Lodging (Need/Confirmed), Cash (Need/Confirmed)
- **Volunteer Roles:** "X/4 Roles Filled" (or however many roles exist)
- **Gym Fee:** Status badge
- **Urgent Reminders:** Any red-urgency notes displayed prominently
- **Recent Activity:** Last 5 changes made (optional, nice-to-have)

### Branding
- Primary color: Orange (#FF6600 or similar PGU orange)
- Secondary color: Black (#1A1A1A)
- Accent: White (#FFFFFF)
- Font: Clean sans-serif (Inter, system font stack)
- App title in header: "PGU 2026 Tour Hub — Goodland"

---

## Features (v1)

1. **Add/Edit/Delete** across all sections (coaches, sponsors, volunteers, contacts, notes)
2. **Status dropdowns** with color-coded badges (Confirmed = green, Need = red/orange, N/A = gray)
3. **Sponsor Level dropdown** (Platinum, Gold, Silver, Bronze) visible when sponsor is Confirmed
4. **Urgency color coding** on Reminders (Red, Orange, Green)
5. **Search and filter** on Contacts page
6. **Dashboard summary** with fill counts and status overview
7. **Coach assignment** from roster dropdown when filling schedule slots
8. **localStorage persistence** — data survives browser refresh
9. **Seed data** pre-loaded on first run from the tables above
10. **Responsive layout** — works on laptop and tablet

---

## Future Ideas (DO NOT BUILD YET)

- **Phase 2:** Duplicate structure for Limon, Marion, South Bend stops
- **Phase 3:** Cross-stop dashboard ("Which stops still need coaches?")
- **Phase 4:** ACTIVE integration for registration data
- Export to PDF or print view for day-of operations
- Email/text reminders for unfilled roles approaching camp date
- Athlete registration tracker per stop
- Budget tracker per stop

---

## Suggested Claude Code Prompt

```
Read pgu-goodland-camp-hub-spec.md and build the entire app based on that spec. Use Vite + React + Tailwind. Start with the data models and localStorage layer, then build the UI components section by section. Seed the app with all pre-loaded data on first run. Use orange (#FF6600) and black (#1A1A1A) as the primary brand colors.
```
