# PGU 2026 Tour Hub — All Stops

## Overview

A React web app serving as the operational hub for Point Guard University's 2026 Summer Camp Tour across four stops: Limon CO, Goodland KS, Marion KS, and South Bend IN.

The app opens to a **master camp selector screen** with PGU branding. The user picks a camp stop, and that stop's full CRM loads. A dropdown or back button is always available to switch between stops or return to the selector.

This replaces static PDFs and Google Sheets with a live, interactive operations hub.

**Tech Stack:** Vite + React + Tailwind CSS
**Data Storage:** Browser localStorage (solo user, v1)
**Design Direction:** Clean, modern dashboard. PGU brand colors (orange and black).

---

## App Structure

### Master Camp Selector (Landing Screen)

- Full-screen landing with PGU logo/branding (orange and black)
- Title: "PGU 2026 Summer Camp Tour"
- Four large cards or buttons, one per stop:
  - **Limon, CO**
  - **Goodland, KS**
  - **Marion, KS**
  - **South Bend, IN**
- Each card shows a quick status summary:
  - Coaching slots filled (e.g., "0/24 Coaches")
  - Sponsor status (e.g., "1/3 Sponsors Confirmed")
  - Volunteer roles filled (e.g., "1/4 Roles Filled")
- Clicking a card opens that stop's full CRM

### Camp Stop CRM (Per-Stop View)

Once inside a stop, the layout matches the current Goodland build:
- **Persistent dropdown or back button** in the header to switch stops or return to the master selector
- Header shows: "PGU 2026 Tour Hub — [Stop Name]"
- Sidebar navigation with all sections (Dashboard, Coaching Schedule, Coach Roster, Key Personnel, Sponsors, Volunteer Roles, Reminders & Notes, Contacts)

---

## Stop-Specific Configuration

### Coaching Slots Per Day

Each stop has a different number of coach slots per day. **Thursday is always 4 slots** regardless of stop.

| Stop | Monday | Tuesday | Wednesday | Thursday |
|------|--------|---------|-----------|----------|
| Limon, CO | 5 | 5 | 5 | 4 |
| Goodland, KS | 7 | 7 | 7 | 4 |
| Marion, KS | 4 | 4 | 4 | 4 |
| South Bend, IN | 6 | 6 | 6 | 4 |

All coaching schedule day slots start as "Need" status (no pre-populated day assignments).

### Sponsor Categories Per Stop

| Stop | Food | Lodging | Cash |
|------|------|---------|------|
| Limon, CO | Yes | Yes | Yes |
| Goodland, KS | Yes | Yes | Yes |
| Marion, KS | Yes | **No** | Yes |
| South Bend, IN | Yes | **No** | Yes |

Marion and South Bend do not need Lodging sponsor tracking. Hide or mark N/A for those stops.

---

## Data Models (Per Stop)

Each stop has its own independent data for every section below.

### 1. Coaching Schedule

A grid showing Monday through Thursday with the configured number of slots per day (see table above).

Each slot has:
- `id` (auto-generated)
- `day` — Monday | Tuesday | Wednesday | Thursday
- `slotNumber` — 1 through max for that day
- `coachName` — string (empty if unfilled)
- `contactInfo` — string (phone or email)
- `status` — Confirmed | Need | N/A

**All slots start as "Need" across all stops.** No pre-populated day assignments.

**UI Notes:**
- Display as a 4-column grid (one column per day)
- Each column shows the correct number of rows for that stop/day
- Empty/Need slots = light red or orange background
- Confirmed slots = green background
- N/A slots = gray background
- Click a slot to edit: assign a coach name, contact info, change status
- Header of each column shows day name + fill count (e.g., "Monday — 0/5 Filled")

---

### 2. Coach Options (Roster)

A list of available coaches who can be assigned to schedule slots. Each stop has its own roster.

Each coach has:
- `id` (auto-generated)
- `name` — string
- `contactInfo` — string (phone or email)
- `notes` — string (optional)

**Pre-loaded Data:**

#### Limon, CO

| Name | Contact | Notes |
|------|---------|-------|
| Jim Trahern | (303) 905-8635 | |
| Shawna Larson | (719) 298-1977 | |
| Bleu Ellis | (720) 357-1523 | |
| Camden Smithburg | (719) 775-1249 | |
| Kyrei Zion | (719) 396-9125 | |
| Lee Vigil | (719) 371-2064 | |

#### Goodland, KS

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

#### Marion, KS

No pre-loaded coaches. All entries will be added manually.

#### South Bend, IN

| Name | Contact | Notes |
|------|---------|-------|
| Myles Busby | (574) 360-9612 | |
| Alex Daniel | (765) 749-7099 | |
| Landon Booker | (574) 309-7461 | |
| Eric Gaff | (574) 215-2764 | |
| Julius Smith | (574) 855-0065 | |
| Joe Smith | (260) 705-8255 | |
| Nolin Sharick | (260) 499-0428 | |
| Joey Garwood | (574) 300-6404 | |
| Jason Groves | (574) 305-1415 | |
| John Dupont | (574) 870-7817 | |

**UI Notes:**
- Simple table with add/edit/delete
- When assigning a coach to a schedule slot, show a dropdown populated from this roster (with option to type a new name)

---

### 3. Key Personnel

Important local contacts for each camp stop.

Each person has:
- `id` (auto-generated)
- `name` — string
- `contactInfo` — string (phone, email, or both)
- `role` — string (free text)
- `notes` — string (optional)

**Pre-loaded Data:**

#### Limon, CO

| Name | Contact | Role |
|------|---------|------|
| Dirk Pedersen | (719) 740-0056 | Key Personnel |
| Faith Johnson | (719) 751-3202 | Key Personnel |
| Dave Sheffield | (970) 324-3734 | Key Personnel |
| Calvin McCoy | | Key Personnel |
| Dean Kerns | (720) 527-4928 | Key Personnel |
| Doug Cox | (719) 238-1557 | Key Personnel |

#### Goodland, KS

| Name | Contact | Role |
|------|---------|------|
| Marty Lehman | (785) 821-4640 | Key Personnel |
| Bill Biermann | bill.biermann@usd352.org | Key Personnel |
| Zach McNall | (785) 821-3785 | Key Personnel |
| Mikayla Biermann | (785) 821-6121 | Key Personnel |

#### Marion, KS

No pre-loaded key personnel. All entries will be added manually.

#### South Bend, IN

| Name | Contact | Role |
|------|---------|------|
| Nick Kleva | (574) 386-1734 | Key Personnel |
| Tony Stearns | (574) 298-2432 | Key Personnel |
| Cedrick "New York" Pauline | (269) 830-9822 | Key Personnel |
| Terry Leek | (574) 265-5530 | Key Personnel |
| Will Coatie | (574) 226-1403 | Key Personnel |
| Drew Lutz | (574) 274-0846 | Key Personnel |

---

### 4. Sponsors

Tracking food, lodging (where applicable), and cash sponsors per stop.

Each sponsor has:
- `id` (auto-generated)
- `sponsorType` — Food | Lodging | Cash
- `sponsorName` — string (empty if unfilled)
- `contactInfo` — string
- `level` — Platinum | Gold | Silver | Bronze (dropdown)
- `status` — Confirmed | Need | N/A
- `notes` — string (optional)

**Pre-loaded Data:**

All sponsor entries start as "Need" with no pre-populated names across all stops, except:

#### Limon, CO
- Food: Need
- Lodging: Need
- Cash: Need

#### Goodland, KS
- Food: Need
- Lodging: Need (Notes: "Last Year: Holiday Inn & Suites")
- Cash: Need

#### Marion, KS
- Food: Need
- Cash: Need
- (No Lodging category)

#### South Bend, IN
- Food: Need
- Cash: Need
- (No Lodging category)

**UI Notes:**
- Card or table layout grouped by sponsor type
- Need = red/orange badge, Confirmed = green badge, N/A = gray badge
- Level dropdown appears when status is Confirmed
- Lodging section hidden for Marion and South Bend

---

### 5. Gym Fee

Per-stop gym fee tracking.

- `status` — Confirmed | Need | N/A
- `amount` — string (dollar amount or "FREE")
- `notes` — string

**Pre-loaded Data:**

| Stop | Status | Amount | Notes |
|------|--------|--------|-------|
| Limon, CO | Confirmed | $1,200 | |
| Goodland, KS | Confirmed | FREE | |
| Marion, KS | Confirmed | FREE | |
| South Bend, IN | Confirmed | $4,480 | $1K deposit already paid |

---

### 6. Volunteer Roles

Day-of operational roles that need to be filled per stop.

Each role has:
- `id` (auto-generated)
- `roleName` — string
- `assignedTo` — string (person's name, empty if unfilled)
- `contactInfo` — string
- `status` — Confirmed | Need | N/A

**Pre-loaded Data:**

#### Limon, CO

| Role | Assigned To | Contact | Status |
|------|-------------|---------|--------|
| Registration Table | | | Need |
| Food Runner | | | Need |
| Gym Set-Up | | | Need |
| Photo/Video | Linda O'Connor | | Confirmed |

#### Goodland, KS

| Role | Assigned To | Contact | Status |
|------|-------------|---------|--------|
| Registration Table | | | Need |
| Food Runner | Shane Hollern | (785) 728-8481 | Confirmed |
| Gym Set-Up | | | Need |
| Photo/Video | Linda O'Connor | | Confirmed |

#### Marion, KS

| Role | Assigned To | Contact | Status |
|------|-------------|---------|--------|
| Registration Table | | | Need |
| Food Runner | | | Need |
| Gym Set-Up | | | Need |
| Photo/Video | Linda O'Connor | | Confirmed |

#### South Bend, IN

| Role | Assigned To | Contact | Status |
|------|-------------|---------|--------|
| Registration Table | VJ Mitole | (574) 335-9322 | Confirmed |
| Food Runner | | | Need |
| Gym Set-Up | | | Need |
| Photo/Video | Corey Boyd | | Confirmed |

**UI Notes:**
- Same visual treatment as sponsors: status badges, click to edit
- Add ability to create custom roles beyond the defaults

---

### 7. Reminders & Notes

A catch-all section for camp-specific notes, to-do items, and day-of operations details.

Each entry has:
- `id` (auto-generated)
- `title` — string
- `details` — string (optional)
- `urgency` — Red | Orange | Green
- `createdAt` — timestamp
- `completed` — boolean

**Pre-loaded Data:**

#### Limon, CO
No pre-loaded reminders.

#### Goodland, KS
| Title | Details | Urgency |
|-------|---------|---------|
| Schemm Trophy | Thursday @ TBD | Orange |

#### Marion, KS
No pre-loaded reminders.

#### South Bend, IN
| Title | Details | Urgency |
|-------|---------|---------|
| Set-Up Time | Monday Morning / 7:30 AM | Orange |
| Camp Dates | June 29 - July 2 | Green |

**UI Notes:**
- Entry form at top: title field, details field, urgency dropdown (Red/Orange/Green), submit button
- List below sorted by urgency (Red first, then Orange, then Green)
- Red = urgent/blocking, Orange = important/upcoming, Green = informational
- Checkbox to mark complete (completed items move to bottom, grayed out)
- Click to edit any entry

---

### 8. Contacts (Master List)

A unified contact directory per stop. Auto-populated from all other sections, plus allows adding standalone contacts.

Each contact has:
- `id` (auto-generated)
- `name` — string
- `contactInfo` — string
- `role` — string (Coach, Key Personnel, Sponsor, Volunteer, Other)
- `organization` — string (optional)
- `notes` — string (optional)

**UI Notes:**
- Searchable and filterable by role
- Auto-populated from coaches, key personnel, sponsors, and volunteers on first run

---

## Branding & Layout

### Master Selector
- Full PGU branding: orange (#FF6600) and black (#1A1A1A)
- Large PGU title, four camp stop cards
- Each card shows quick-glance status counts

### Camp Stop CRM
- Header: "PGU 2026 Tour Hub — [Stop Name]"
- **Camp stop dropdown** in the header to switch between stops without going back to selector
- **Back to All Stops** button to return to master selector
- Sidebar navigation with all sections
- Primary color: Orange (#FF6600)
- Secondary color: Black (#1A1A1A)
- Accent: White (#FFFFFF)
- Font: Clean sans-serif (Inter, system font stack)

---

## Features (v1)

1. **Master camp selector** with per-stop status summaries
2. **Switch between stops** via header dropdown without returning to selector
3. **Add/Edit/Delete** across all sections per stop
4. **Status dropdowns** with color-coded badges (Confirmed = green, Need = red/orange, N/A = gray)
5. **Sponsor Level dropdown** (Platinum, Gold, Silver, Bronze)
6. **Urgency color coding** on Reminders (Red, Orange, Green)
7. **Search and filter** on Contacts page
8. **Per-stop dashboard** with fill counts and status overview
9. **Coach assignment** from roster dropdown when filling schedule slots
10. **Stop-specific sponsor categories** (no Lodging for Marion and South Bend)
11. **Variable coaching slots** per day per stop (with Thursday always at 4)
12. **localStorage persistence** with data separated by stop
13. **Seed data** pre-loaded on first run from the tables above
14. **Responsive layout** — works on laptop and tablet

---

## Future Ideas (DO NOT BUILD YET)

- Deploy to Vercel/Netlify with real database backend
- ACTIVE integration for registration data
- Cross-stop master dashboard with aggregate stats
- Export to PDF or print view for day-of operations
- Email/text reminders for unfilled roles approaching camp date
- Athlete registration tracker per stop
- Budget tracker per stop
- 2027 Rollovers section per stop

---

## Suggested Claude Code Prompt

```
Read pgu-tour-hub-spec.md and build the entire app based on that spec. Use Vite + React + Tailwind. Start with the master camp selector screen, then build the per-stop CRM with all sections. Each stop has its own independent data stored separately in localStorage. Seed all four stops with the pre-loaded data on first run. Use orange (#FF6600) and black (#1A1A1A) as the primary brand colors. Thursday coaching slots are always 4 regardless of stop.
```
