# MLA E-Office — UI Design System

> **Complete Design Tokens, Component Specifications, Layout System, and Visual Standards for Production UI Development**
> 
> This document is the **single source of truth** for all visual decisions. Every React component, CSS Module, and page layout must reference these tokens. Do not hardcode colors, sizes, or spacing anywhere — use CSS Custom Properties exclusively.
> 
> *Related Documents:* [TECH_STACK.md](file:///s:/MLA%20E%20-%20Office/TECH_STACK.md) | [PROJECT_OVERVIEW.md](file:///s:/MLA%20E%20-%20Office/PROJECT_OVERVIEW.md) | [USER_ROLES.md](file:///s:/MLA%20E%20-%20Office/USER_ROLES.md) | [PROJECT_SECTIONS_BREAKDOWN.md](file:///s:/MLA%20E%20-%20Office/PROJECT_SECTIONS_BREAKDOWN.md) | [MASTER_DATA.md](file:///s:/MLA%20E%20-%20Office/MASTER_DATA.md)

---

## 📌 Design Decisions Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Visual Theme** | Professional & Trustworthy | Clean government feel — conveys authority, reliability, and civic duty |
| **Primary Color** | Navy Blue (`#1B3A5C`) | Trusted, authoritative, works for government/political applications |
| **Dark Mode** | Both light & dark with toggle | User preference; system-default detection with manual override |
| **Typography** | Inter (UI) + Noto Sans Devanagari (Marathi) | Inter for clean modern text; Noto Sans Devanagari for accurate Marathi rendering |
| **Layout** | Collapsible left sidebar | Full labels when expanded (240px), icon-only when collapsed (64px) |
| **Border Radius** | Sharp corners (0–4px) | Formal, structured, government-appropriate aesthetic |
| **Icon Library** | Lucide React | Lightweight, consistent stroke icons — per TECH_STACK.md |
| **Styling Method** | CSS Modules + CSS Custom Properties | Scoped styles, no framework dependency — per TECH_STACK.md |
| **Charts** | Recharts (standard) + D3.js (advanced) | Per TECH_STACK.md |

---

## 1. Color Palette

### 1A. Brand / Primary Colors

The primary palette is built from a **navy blue** base — professional, trustworthy, and universally appropriate for government applications. The accent is a **warm amber** that provides energy and visibility for CTAs and highlights.

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--color-primary-50` | `#EFF4F9` | `#0D1B2A` | Tinted backgrounds, hover states |
| `--color-primary-100` | `#D6E4F0` | `#122640` | Selected row highlights |
| `--color-primary-200` | `#ADC9E0` | `#1A3355` | Subtle borders on active elements |
| `--color-primary-300` | `#7BAAC8` | `#234A75` | Secondary icon fills |
| `--color-primary-400` | `#4A8BB0` | `#2D6295` | Hover state for primary buttons |
| `--color-primary-500` | `#1B6B98` | `#3A7DB8` | Links, secondary actions |
| `--color-primary-600` | `#1B3A5C` | `#5A9BD5` | **Primary brand color** — buttons, sidebar header, active tab |
| `--color-primary-700` | `#152E49` | `#7AB3E0` | Pressed/active state |
| `--color-primary-800` | `#102337` | `#9ECBE8` | Dark heading text on light bg |
| `--color-primary-900` | `#0A1724` | `#C2DFF0` | Darkest brand shade |

### 1B. Accent Colors (Amber/Gold)

Used sparingly for primary CTAs, notifications, and highlights that need to pop against the navy palette.

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--color-accent-50` | `#FFF8E1` | `#1A1400` | Badge backgrounds |
| `--color-accent-100` | `#FFECB3` | `#2E2400` |  |
| `--color-accent-200` | `#FFE082` | `#473800` |  |
| `--color-accent-300` | `#FFD54F` | `#614E00` |  |
| `--color-accent-400` | `#FFCA28` | `#7A6300` |  |
| `--color-accent-500` | `#FFC107` | `#947800` | **Primary accent** — CTA buttons, badges, important highlights |
| `--color-accent-600` | `#FFB300` | `#B89200` | Hover state for accent buttons |
| `--color-accent-700` | `#FF8F00` | `#D4A800` |  |

### 1C. Neutral / Gray Scale

The backbone of the UI — backgrounds, text, borders, dividers.

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--color-gray-0` | `#FFFFFF` | `#0F1419` | Page background (light) / card background (dark) |
| `--color-gray-25` | `#FAFBFC` | `#131A22` | Alternate table row |
| `--color-gray-50` | `#F5F7FA` | `#1A2332` | Page background (subtle), input backgrounds |
| `--color-gray-100` | `#EDF0F5` | `#1F2D3D` | Card backgrounds, sidebar bg |
| `--color-gray-200` | `#DDE3EB` | `#2A3A4E` | Borders, dividers |
| `--color-gray-300` | `#C5CED8` | `#3A4D63` | Disabled borders, placeholder dividers |
| `--color-gray-400` | `#94A3B8` | `#4F6479` | Placeholder text, disabled icons |
| `--color-gray-500` | `#64748B` | `#6B8299` | Secondary text, captions |
| `--color-gray-600` | `#475569` | `#8EA3B8` | Body text (secondary) |
| `--color-gray-700` | `#334155` | `#A8BDD1` | Body text (primary in dark mode) |
| `--color-gray-800` | `#1E293B` | `#C5D5E4` | Headings, strong text |
| `--color-gray-900` | `#0F172A` | `#E2ECF4` | Primary body text (light mode) |

### 1D. Semantic / Status Colors

> **Source:** Status values from [MASTER_DATA.md](file:///s:/MLA%20E%20-%20Office/MASTER_DATA.md) — Sections 4B (Nivedan), 4C (Inward), 4D (Priority), 4H (Dev Works), 4K (Calendar Events).

#### Status Color Tokens

| Token | Hex (Light Mode) | Hex (Dark Mode) | CSS Variable |
|-------|----------|----------|-------------|
| **Success / Green** | `#16A34A` | `#22C55E` | `--color-success` |
| Success Background | `#F0FDF4` | `#052E16` | `--color-success-bg` |
| Success Border | `#BBF7D0` | `#166534` | `--color-success-border` |
| **Warning / Amber** | `#D97706` | `#F59E0B` | `--color-warning` |
| Warning Background | `#FFFBEB` | `#2E1D05` | `--color-warning-bg` |
| Warning Border | `#FDE68A` | `#78350F` | `--color-warning-border` |
| **Error / Red** | `#DC2626` | `#EF4444` | `--color-error` |
| Error Background | `#FEF2F2` | `#2E0505` | `--color-error-bg` |
| Error Border | `#FECACA` | `#7F1D1D` | `--color-error-border` |
| **Info / Blue** | `#2563EB` | `#3B82F6` | `--color-info` |
| Info Background | `#EFF6FF` | `#0C1929` | `--color-info-bg` |
| Info Border | `#BFDBFE` | `#1E3A5F` | `--color-info-border` |
| **Purple** | `#7C3AED` | `#A78BFA` | `--color-purple` |
| Purple Background | `#F5F3FF` | `#1E0A3E` | `--color-purple-bg` |
| Purple Border | `#DDD6FE` | `#4C1D95` | `--color-purple-border` |
| **Orange** | `#EA580C` | `#F97316` | `--color-orange` |
| Orange Background | `#FFF7ED` | `#2E1505` | `--color-orange-bg` |
| Orange Border | `#FED7AA` | `#7C2D12` | `--color-orange-border` |
| **Neutral / Gray** | `#6B7280` | `#9CA3AF` | `--color-neutral` |
| Neutral Background | `#F3F4F6` | `#1F2937` | `--color-neutral-bg` |
| Neutral Border | `#D1D5DB` | `#374151` | `--color-neutral-border` |

#### Status → Color Mapping (Nivedan)

> From `NIVEDAN_STATUS` in [MASTER_DATA.md](file:///s:/MLA%20E%20-%20Office/MASTER_DATA.md) Section 4B.

| Status | Color Token | Badge Color | Emoji |
|--------|------------|-------------|-------|
| `PENDING` | `--color-warning` | Amber badge | 🟡 |
| `IN_PROGRESS` | `--color-info` | Blue badge | 🔵 |
| `FORWARDED` | `--color-orange` | Orange badge | 🟠 |
| `AWAITING_RESPONSE` | `--color-purple` | Purple badge | 🟣 |
| `RESOLVED` | `--color-success` | Green badge | 🟢 |
| `REJECTED` | `--color-error` | Red badge | 🔴 |
| `CANCELLED` | `--color-neutral` | Gray badge | ⚪ |
| `ARCHIVED` | `--color-neutral` | Dark gray badge | ⚫ |

#### Status → Color Mapping (Inward)

> From `INWARD_STATUS` in [MASTER_DATA.md](file:///s:/MLA%20E%20-%20Office/MASTER_DATA.md) Section 4C.

| Status | Color Token |
|--------|------------|
| `PENDING` | `--color-warning` |
| `ASSIGNED` | `--color-info` |
| `IN_PROGRESS` | `--color-purple` |
| `COMPLETED` | `--color-success` |
| `CANCELLED` | `--color-neutral` |

#### Status → Color Mapping (Development Works)

> From `DEVWORK_STATUS` in [MASTER_DATA.md](file:///s:/MLA%20E%20-%20Office/MASTER_DATA.md) Section 4H.

| Status | Color Token |
|--------|------------|
| `SANCTIONED` | `--color-info` |
| `IN_PROGRESS` | `--color-warning` |
| `COMPLETED` | `--color-success` |
| `DELAYED` | `--color-error` |
| `CANCELLED` | `--color-neutral` |

#### Priority → Color Mapping

> From `PRIORITY` in [MASTER_DATA.md](file:///s:/MLA%20E%20-%20Office/MASTER_DATA.md) Section 4D.

| Priority | Color Token | Visual |
|----------|------------|--------|
| `HIGH` | `--color-error` | Red dot/badge |
| `MEDIUM` | `--color-warning` | Amber dot/badge |
| `LOW` | `--color-success` | Green dot/badge |

#### Calendar Event Type → Color Mapping

> From `EVENT_TYPE` in [MASTER_DATA.md](file:///s:/MLA%20E%20-%20Office/MASTER_DATA.md) Section 4K.

| Event Type | Color Token |
|-----------|------------|
| `MEETING` | `--color-info` |
| `PUBLIC_PROGRAM` | `--color-success` |
| `GOVT_DEADLINE` | `--color-error` |
| `ASSEMBLY_SESSION` | `--color-purple` |
| `CONSTITUENCY_VISIT` | `--color-orange` |
| `PERSONAL` | `--color-neutral` |

---

## 2. Typography

### 2A. Font Families

| Token | Value | Usage |
|-------|-------|-------|
| `--font-family-primary` | `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` | All English UI text — headings, body, labels, buttons |
| `--font-family-marathi` | `'Noto Sans Devanagari', 'Mangal', 'Devanagari MT', sans-serif` | All Marathi (मराठी) text when `lang="mr"` is active |
| `--font-family-mono` | `'JetBrains Mono', 'Fira Code', 'Consolas', monospace` | Tracking IDs, inward/outward numbers, code |

### 2B. Font Loading

```html
<!-- Google Fonts — load in <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### 2C. Type Scale

Based on a **1.250 (Major Third) ratio** — compact enough for data-dense government dashboards, with clear hierarchy.

| Token | Size (rem) | Size (px) | Line Height | Weight | Usage |
|-------|-----------|-----------|-------------|--------|-------|
| `--text-2xs` | `0.625rem` | 10px | 1.4 | 400 | Fine print, timestamp seconds |
| `--text-xs` | `0.75rem` | 12px | 1.5 | 400 | Captions, helper text, table footers |
| `--text-sm` | `0.8125rem` | 13px | 1.5 | 400 | Badge labels, small metadata |
| `--text-base` | `0.875rem` | 14px | 1.6 | 400 | **Default body text**, table cells, form labels |
| `--text-md` | `1rem` | 16px | 1.6 | 400 | Emphasized body, input values |
| `--text-lg` | `1.125rem` | 18px | 1.5 | 600 | Card titles, section sub-headers |
| `--text-xl` | `1.25rem` | 20px | 1.4 | 600 | Page section titles |
| `--text-2xl` | `1.5rem` | 24px | 1.35 | 700 | Page titles |
| `--text-3xl` | `1.875rem` | 30px | 1.3 | 700 | Dashboard KPI numbers |
| `--text-4xl` | `2.25rem` | 36px | 1.2 | 700 | Hero numbers, large KPIs |

### 2D. Font Weights

| Token | Value | Usage |
|-------|-------|-------|
| `--font-light` | `300` | Decorative large numbers only |
| `--font-regular` | `400` | Body text, table cells, descriptions |
| `--font-medium` | `500` | Form labels, navigation items, button text |
| `--font-semibold` | `600` | Card titles, table headers, section headers |
| `--font-bold` | `700` | Page titles, KPI values, emphasis |

### 2E. Marathi Typography Rules

When the user toggles to Marathi (`lang="mr"`):

| Rule | Detail |
|------|--------|
| Font swap | `--font-family-primary` → `--font-family-marathi` |
| Size adjustment | Increase `font-size` by **+1px** at `--text-base` and below (Devanagari glyphs need slightly more space) |
| Line height | Increase by **+0.1** for Devanagari (more ascenders/descenders) |
| Number format | Use Indian numbering: `1,00,000` not `100,000` — handled by `Intl.NumberFormat('en-IN')` |
| Date format | `DD/MM/YYYY` — display with Marathi month names where applicable |

---

## 3. Spacing Scale

An **8px base grid** system. All padding, margin, and gap values must use these tokens.

| Token | Value | px | Usage Examples |
|-------|-------|---:|-------|
| `--space-0` | `0` | 0 | Reset |
| `--space-0.5` | `0.125rem` | 2 | Inline icon gap |
| `--space-1` | `0.25rem` | 4 | Tight inner padding (badges) |
| `--space-1.5` | `0.375rem` | 6 | Small icon margins |
| `--space-2` | `0.5rem` | 8 | **Base unit** — inner padding, small gaps |
| `--space-3` | `0.75rem` | 12 | Button padding (vertical), input padding |
| `--space-4` | `1rem` | 16 | Card padding, form field gap, section gap |
| `--space-5` | `1.25rem` | 20 | Large button padding |
| `--space-6` | `1.5rem` | 24 | Card internal sections, group gaps |
| `--space-8` | `2rem` | 32 | Section spacing, page top margin |
| `--space-10` | `2.5rem` | 40 | Large section spacing |
| `--space-12` | `3rem` | 48 | Page title bottom margin |
| `--space-16` | `4rem` | 64 | Major section breaks |
| `--space-20` | `5rem` | 80 | Page-level vertical rhythm |
| `--space-24` | `6rem` | 96 | Sidebar width (collapsed) |

---

## 4. Border Radius

Sharp corners per design decision — formal, structured, government-appropriate.

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-none` | `0` | Square elements |
| `--radius-sm` | `2px` | Badges, small tags, inline elements |
| `--radius-base` | `3px` | **Default** — buttons, inputs, cards, modals, dropdowns |
| `--radius-md` | `4px` | Larger cards, panels |
| `--radius-full` | `9999px` | Avatars, circular icons, pill badges, toggle switches |

> **Rule:** Never use `border-radius` values above `4px` except for circular elements (`--radius-full`). This maintains the formal government aesthetic.

---

## 5. Elevation / Shadows

Shadows are used sparingly — the design relies on borders and background contrast for depth.

| Token | Light Mode Value | Dark Mode Value | Usage |
|-------|-----------------|-----------------|-------|
| `--shadow-none` | `none` | `none` | Flat elements |
| `--shadow-xs` | `0 1px 2px rgba(15,23,42,0.05)` | `0 1px 2px rgba(0,0,0,0.3)` | Subtle lift — inputs, badges |
| `--shadow-sm` | `0 1px 3px rgba(15,23,42,0.08), 0 1px 2px rgba(15,23,42,0.04)` | `0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.2)` | Cards, dropdown menus |
| `--shadow-md` | `0 4px 6px rgba(15,23,42,0.07), 0 2px 4px rgba(15,23,42,0.04)` | `0 4px 6px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.2)` | Modals, popover panels |
| `--shadow-lg` | `0 10px 15px rgba(15,23,42,0.08), 0 4px 6px rgba(15,23,42,0.04)` | `0 10px 15px rgba(0,0,0,0.5), 0 4px 6px rgba(0,0,0,0.3)` | Modal dialogs, toast notifications |
| `--shadow-xl` | `0 20px 25px rgba(15,23,42,0.1), 0 8px 10px rgba(15,23,42,0.04)` | `0 20px 25px rgba(0,0,0,0.6), 0 8px 10px rgba(0,0,0,0.3)` | Command palette, search overlay |
| `--shadow-sidebar` | `2px 0 8px rgba(15,23,42,0.06)` | `2px 0 8px rgba(0,0,0,0.4)` | Sidebar right edge |

---

## 6. Layout System

### 6A. Application Shell

```
┌──────────────────────────────────────────────────────────────────────┐
│  TOP BAR (56px height, fixed)                                        │
│  [≡ Toggle] [Logo / App Name]   [🔍 Global Search]   [🌐][🔔][👤]  │
├──────────┬───────────────────────────────────────────────────────────┤
│          │                                                           │
│ SIDEBAR  │                    MAIN CONTENT AREA                      │
│          │                                                           │
│ Expanded │  ┌─────────────────────────────────────────────────┐     │
│ = 240px  │  │  PAGE HEADER                                    │     │
│          │  │  Page Title + Breadcrumb + Action Buttons        │     │
│ Collapsed│  └─────────────────────────────────────────────────┘     │
│ = 64px   │                                                           │
│          │  ┌─────────────────────────────────────────────────┐     │
│ Contains:│  │  PAGE CONTENT                                   │     │
│ - Nav    │  │  (Cards, Tables, Forms, Charts — varies by page)│     │
│   items  │  │                                                  │     │
│ - Icons  │  │                                                  │     │
│ - Labels │  │                                                  │     │
│   (when  │  │                                                  │     │
│   open)  │  │                                                  │     │
│          │  └─────────────────────────────────────────────────┘     │
│          │                                                           │
└──────────┴───────────────────────────────────────────────────────────┘
```

### 6B. Layout Dimensions

| Token | Value | Description |
|-------|-------|-------------|
| `--layout-topbar-height` | `56px` | Fixed top navigation bar |
| `--layout-sidebar-expanded` | `240px` | Sidebar width when fully open |
| `--layout-sidebar-collapsed` | `64px` | Sidebar width when icon-only |
| `--layout-content-max-width` | `1440px` | Max width of main content area |
| `--layout-content-padding` | `24px` | Padding around the main content area |
| `--layout-page-header-height` | `64px` | Page title row height |

### 6C. Sidebar Specification

| Property | Expanded State | Collapsed State |
|----------|---------------|----------------|
| Width | `240px` | `64px` |
| Background | `--color-primary-600` (navy) | `--color-primary-600` (navy) |
| Text Color | `--color-gray-0` (white) | — |
| Icon Color | `--color-primary-200` (light blue) | `--color-primary-200` |
| Active Item BG | `rgba(255,255,255,0.12)` | `rgba(255,255,255,0.12)` |
| Active Item Text | `#FFFFFF` | — |
| Active Item Icon | `#FFFFFF` | `#FFFFFF` |
| Hover Item BG | `rgba(255,255,255,0.08)` | `rgba(255,255,255,0.08)` |
| Item Padding | `12px 16px` | `12px 20px` (centered icon) |
| Icon Size | `20px` | `20px` |
| Section Divider | `1px solid rgba(255,255,255,0.1)` | `1px solid rgba(255,255,255,0.1)` |
| Logo Area Height | `56px` (matches topbar) | `56px` |
| Transition | `width 250ms ease` | `width 250ms ease` |
| Toggle Button | Hamburger icon in topbar | Hamburger icon in topbar |

#### Sidebar Navigation Items

> Menu structure from [PROJECT_SECTIONS_BREAKDOWN.md](file:///s:/MLA%20E%20-%20Office/PROJECT_SECTIONS_BREAKDOWN.md) — 13 modules grouped under 4 pillars.
> Role visibility from [USER_ROLES.md](file:///s:/MLA%20E%20-%20Office/USER_ROLES.md).

| Icon | Label (EN) | Label (MR) | Route | Visible To |
|------|-----------|-----------|-------|-----------|
| `LayoutDashboard` | Dashboard | डॅशबोर्ड | `/dashboard` | MLA, PA, Admin |
| `Mail` | Inward & Outward | आवक-जावक | `/correspondence` | MLA, PA, Receptionist, Admin |
| `UserCheck` | Visitor Book | व्हिजिटर बुक | `/visitors` | MLA, PA, Receptionist, Admin |
| `FileText` | Nivedans | निवेदने | `/nivedans` | MLA, PA, Receptionist, Admin |
| `Hammer` | Development Works | विकासकामे | `/dev-works` | MLA, PA, Auditor, Admin |
| `Users` | Karyakarta Master | कार्यकर्ते | `/workers` | MLA, PA, Admin |
| `MapPin` | Gram / Ward | ग्राम / वॉर्ड | `/areas` | MLA, PA, Admin |
| `Vote` | Booth Structure | बूथ रचना | `/booths` | MLA, PA, Auditor, Admin |
| `Calendar` | Calendar | कॅलेंडर | `/calendar` | MLA, PA, Receptionist, Admin |
| `MessageCircle` | WhatsApp | व्हॉट्सअॅप | `/whatsapp` | MLA, PA, Admin |
| `BarChart3` | Reports | अहवाल | `/reports` | MLA, PA, Admin |
| — | *Divider* | — | — | — |
| `Settings` | Settings | सेटिंग्ज | `/settings` | Admin |
| `Shield` | User Management | वापरकर्ते | `/users` | Admin |

### 6D. Top Bar Specification

| Element | Position | Description |
|---------|----------|-------------|
| Sidebar Toggle | Far left | Hamburger icon (`Menu`) — toggles sidebar expanded/collapsed |
| App Logo + Name | Left (after toggle) | "MLA E-Office" text or MLA office logo — customized per installation |
| Global Search | Center | Search input — `min-width: 400px`, `max-width: 560px` — searches across all modules |
| Language Toggle | Right section | `🌐 EN / मराठी` toggle button |
| Notification Bell | Right section | `Bell` icon with unread count badge (red dot) |
| User Avatar + Name | Far right | Profile dropdown → Profile, Change Password, Logout |

### 6E. Responsive Breakpoints

| Token | Value | Behavior |
|-------|-------|----------|
| `--breakpoint-sm` | `640px` | Mobile — sidebar hidden (overlay mode), single-column layout |
| `--breakpoint-md` | `768px` | Tablet — sidebar collapsed by default |
| `--breakpoint-lg` | `1024px` | Small desktop — sidebar collapsed, 2-column where needed |
| `--breakpoint-xl` | `1280px` | Desktop — sidebar expanded by default |
| `--breakpoint-2xl` | `1536px` | Large desktop — max content width applies |

#### Mobile Behavior (`< 768px`)

- Sidebar becomes a **slide-over drawer** with semi-transparent backdrop (`rgba(0,0,0,0.5)`)
- Top bar remains fixed
- Global search moves to a full-width expandable bar
- Tables switch to **card/list view** (one record per card, stacked vertically)
- Forms go single-column

---

## 7. Dark Mode Implementation

### 7A. Strategy

- Use `[data-theme="dark"]` attribute on `<html>` element
- Toggle via a button in the top bar (sun/moon icon)
- **Default:** Respect system preference via `prefers-color-scheme: dark`
- **Override:** User's explicit choice saved in `localStorage` (`theme` key)
- All color tokens are redefined under `[data-theme="dark"]`

### 7B. Dark Mode Surface Colors

| Surface | Light Mode | Dark Mode |
|---------|-----------|-----------|
| App background | `--color-gray-50` (`#F5F7FA`) | `#0F1419` |
| Card / panel background | `--color-gray-0` (`#FFFFFF`) | `#1A2332` |
| Sidebar background | `--color-primary-600` (`#1B3A5C`) | `#0D1B2A` |
| Top bar background | `--color-gray-0` (`#FFFFFF`) | `#131A22` |
| Top bar border-bottom | `--color-gray-200` | `#2A3A4E` |
| Input background | `--color-gray-0` (`#FFFFFF`) | `#1F2D3D` |
| Input border | `--color-gray-300` | `#3A4D63` |
| Modal overlay | `rgba(15,23,42,0.5)` | `rgba(0,0,0,0.7)` |
| Table header bg | `--color-gray-50` | `#1F2D3D` |
| Table row hover | `--color-primary-50` | `rgba(90,155,213,0.08)` |
| Divider / hr | `--color-gray-200` | `#2A3A4E` |

### 7C. Dark Mode Text Colors

| Text Type | Light Mode | Dark Mode |
|-----------|-----------|-----------|
| Primary text | `--color-gray-900` | `--color-gray-800` (dark mode value: `#C5D5E4`) |
| Secondary text | `--color-gray-600` | `--color-gray-500` (dark mode value: `#6B8299`) |
| Muted / caption | `--color-gray-500` | `--color-gray-400` (dark mode value: `#4F6479`) |
| Disabled text | `--color-gray-400` | `--color-gray-400` (dark mode value: `#4F6479`) |
| Link text | `--color-primary-600` | `--color-primary-500` (dark mode value: `#3A7DB8`) |

### 7D. CSS Implementation Pattern

```css
:root {
  /* Light mode (default) */
  --bg-page: var(--color-gray-50);
  --bg-card: var(--color-gray-0);
  --bg-sidebar: var(--color-primary-600);
  --text-primary: var(--color-gray-900);
  --text-secondary: var(--color-gray-600);
  --border-default: var(--color-gray-200);
}

[data-theme="dark"] {
  --bg-page: #0F1419;
  --bg-card: #1A2332;
  --bg-sidebar: #0D1B2A;
  --text-primary: #C5D5E4;
  --text-secondary: #6B8299;
  --border-default: #2A3A4E;
}

/* Usage in components */
.card {
  background: var(--bg-card);
  color: var(--text-primary);
  border: 1px solid var(--border-default);
}
```

---

## 8. Component Specifications

### 8A. Buttons

#### Variants

| Variant | Background | Text | Border | Use Case |
|---------|-----------|------|--------|----------|
| **Primary** | `--color-primary-600` | `#FFFFFF` | none | Main actions: Save, Submit, Create |
| **Secondary** | `transparent` | `--color-primary-600` | `1px solid --color-primary-600` | Cancel, secondary actions |
| **Accent** | `--color-accent-500` | `--color-gray-900` | none | Highlight CTAs: "AI Draft Letter", "Send WhatsApp" |
| **Ghost** | `transparent` | `--color-gray-700` | none | Tertiary actions, icon buttons |
| **Danger** | `--color-error` | `#FFFFFF` | none | Destructive actions: Reject, Cancel Nivedan |
| **Success** | `--color-success` | `#FFFFFF` | none | Approve, Resolve, Complete |

#### Sizes

| Size | Height | Padding | Font Size | Icon Size |
|------|--------|---------|-----------|-----------|
| **Small** | `28px` | `4px 10px` | `--text-xs` (12px) | 14px |
| **Medium** | `36px` | `8px 16px` | `--text-base` (14px) | 16px |
| **Large** | `44px` | `10px 24px` | `--text-md` (16px) | 20px |

#### States

| State | Transform | Opacity/Effect |
|-------|-----------|----------------|
| Default | — | — |
| Hover | — | Background darkens 8% (`filter: brightness(0.92)`) |
| Active/Pressed | — | Background darkens 12% (`filter: brightness(0.88)`) |
| Focused | — | `outline: 2px solid --color-primary-400; outline-offset: 2px` |
| Disabled | — | `opacity: 0.5; cursor: not-allowed` |
| Loading | — | Text hidden, spinner centered, `pointer-events: none` |

### 8B. Form Inputs

| Property | Value |
|----------|-------|
| Height | `36px` (Medium), `28px` (Small), `44px` (Large) |
| Background | `--bg-card` |
| Border | `1px solid --color-gray-300` |
| Border (focus) | `1px solid --color-primary-500` + `box-shadow: 0 0 0 3px rgba(27,58,92,0.12)` |
| Border (error) | `1px solid --color-error` + `box-shadow: 0 0 0 3px rgba(220,38,38,0.1)` |
| Border Radius | `--radius-base` (3px) |
| Padding | `8px 12px` |
| Font Size | `--text-base` (14px) |
| Placeholder Color | `--color-gray-400` |
| Disabled BG | `--color-gray-50` |
| Label | Above input, `--text-sm` (13px), `--font-medium`, `--color-gray-700` |
| Helper Text | Below input, `--text-xs` (12px), `--color-gray-500` |
| Error Message | Below input, `--text-xs` (12px), `--color-error` |
| Required Marker | Red asterisk `*` after label text |

### 8C. Data Tables

> Primary display component — used in Inward Register, Nivedan List, Visitor Book, Karyakarta List, Dev Works List.

| Property | Value |
|----------|-------|
| Header BG | `--color-gray-50` (light) / `#1F2D3D` (dark) |
| Header Text | `--text-xs` (12px), `--font-semibold`, `text-transform: uppercase`, `letter-spacing: 0.5px`, `--color-gray-600` |
| Header Border Bottom | `2px solid --color-gray-200` |
| Row Height | `44px` minimum |
| Row Border Bottom | `1px solid --color-gray-100` |
| Row Hover BG | `--color-primary-50` |
| Alternate Row BG | `--color-gray-25` (optional — can be toggled) |
| Cell Padding | `12px 16px` |
| Cell Text | `--text-base` (14px), `--color-gray-900` |
| Pagination | Bottom right — "Showing 1-25 of 342" + page controls |
| Rows Per Page | Default `25`, options: `10, 25, 50, 100` |
| Sortable Header | Click to toggle ↑↓ — active sort column indicated with bold text + arrow |
| Sticky Header | `position: sticky; top: 0` when scrolling |
| Empty State | Centered illustration + "No records found" message |
| Loading State | Skeleton rows (8 rows of animated gray bars) |

### 8D. Cards

> Used for KPI cards on Dashboard, entity detail views, form sections.

| Property | Value |
|----------|-------|
| Background | `--bg-card` |
| Border | `1px solid --color-gray-200` |
| Border Radius | `--radius-md` (4px) |
| Shadow | `--shadow-sm` |
| Padding | `--space-6` (24px) |
| Hover (clickable) | `--shadow-md`, `border-color: --color-primary-200` |

#### KPI Card (Dashboard)

```
┌──────────────────────────┐
│  📊  Total Nivedans       │  ← Icon + Label (--text-sm, --color-gray-500)
│                           │
│  1,247                    │  ← Value (--text-3xl, --font-bold, --color-gray-900)
│                           │
│  ↑ 12% from last month   │  ← Trend (--text-xs, --color-success or --color-error)
└──────────────────────────┘
```

| KPI Card Property | Value |
|-------------------|-------|
| Min Width | `200px` |
| Icon | `24px`, `--color-primary-400` |
| Value Font | `--text-3xl` (30px), `--font-bold` |
| Trend Arrow Up | `--color-success` |
| Trend Arrow Down | `--color-error` |
| Grid Layout | `repeat(auto-fill, minmax(200px, 1fr))` with `--space-4` gap |

### 8E. Status Badges

Inline pill-like badges showing entity status.

| Property | Value |
|----------|-------|
| Height | `22px` |
| Padding | `2px 8px` |
| Font Size | `--text-xs` (12px) |
| Font Weight | `--font-medium` (500) |
| Border Radius | `--radius-sm` (2px) |
| Text Transform | `uppercase` |
| Letter Spacing | `0.3px` |

Each status uses its mapped color (see Section 1D):
- **Background:** `--color-{status}-bg`
- **Text:** `--color-{status}`
- **Border:** `1px solid --color-{status}-border`

Example for `PENDING`:
```css
.badge-pending {
  background: var(--color-warning-bg);
  color: var(--color-warning);
  border: 1px solid var(--color-warning-border);
}
```

### 8F. Modals / Dialogs

| Property | Value |
|----------|-------|
| Overlay | `rgba(15,23,42,0.5)` light / `rgba(0,0,0,0.7)` dark |
| Width | Small: `400px`, Medium: `560px`, Large: `720px`, Full: `90vw` |
| Max Height | `85vh` with internal scroll |
| Background | `--bg-card` |
| Border Radius | `--radius-md` (4px) |
| Shadow | `--shadow-lg` |
| Header | `--text-lg`, `--font-semibold`, bottom border `1px solid --border-default` |
| Footer | Top border, right-aligned buttons |
| Animation | Fade in + slight scale (`0.95 → 1.0`) over `200ms ease-out` |
| Close Button | `X` icon, top-right corner, ghost button style |

### 8G. Toast Notifications

> Using `react-toastify` per TECH_STACK.md — themed to match design system.

| Property | Value |
|----------|-------|
| Position | Top-right |
| Width | `360px` |
| Border Radius | `--radius-base` (3px) |
| Shadow | `--shadow-md` |
| Auto-dismiss | `5000ms` (success), `8000ms` (error), `0` (action-required) |
| Types | Success (green left-border), Error (red), Warning (amber), Info (blue) |
| Left Border | `4px solid` using semantic color |

### 8H. File Upload Zone

> Using `react-dropzone` per TECH_STACK.md.

| Property | Value |
|----------|-------|
| Border | `2px dashed --color-gray-300` |
| Border (drag-over) | `2px dashed --color-primary-500` |
| Background (drag-over) | `--color-primary-50` |
| Border Radius | `--radius-md` (4px) |
| Min Height | `120px` |
| Icon | `Upload` from Lucide, `32px`, `--color-gray-400` |
| Text | "Drag & drop files here or click to browse" — `--text-sm`, `--color-gray-500` |
| File Types | Shown as chips below — "PDF, JPG, PNG — Max 10MB" |

### 8I. Empty States

When a table or list has no data:

| Property | Value |
|----------|-------|
| Container | Centered vertically and horizontally within the content area |
| Illustration | Simple line illustration (optional) or Lucide icon (`FolderOpen`, `Inbox`) at `64px`, `--color-gray-300` |
| Title | `--text-lg`, `--font-semibold`, `--color-gray-700` — e.g., "No Nivedans Found" |
| Description | `--text-base`, `--color-gray-500` — e.g., "Create your first nivedan to get started" |
| Action Button | Primary button — "Create Nivedan", "Add Entry" |

---

## 9. Iconography

### 9A. Icon System

| Property | Value |
|----------|-------|
| Library | **Lucide React** (`lucide-react` — per TECH_STACK.md) |
| Default Size | `20px` (in body), `16px` (in buttons/badges), `24px` (in sidebar/headers) |
| Default Stroke Width | `1.75` |
| Color | Inherits from `currentColor` — so it follows text color |

### 9B. Key Icon Mapping

| Concept | Lucide Icon Name |
|---------|-----------------|
| Dashboard | `LayoutDashboard` |
| Inward | `Mail` |
| Outward | `Send` |
| Nivedan | `FileText` |
| Visitor | `UserCheck` |
| Dev Works | `Hammer` |
| Workers | `Users` |
| Booth | `Vote` |
| Calendar | `Calendar` |
| WhatsApp | `MessageCircle` |
| Reports | `BarChart3` |
| Settings | `Settings` |
| Search | `Search` |
| Filter | `Filter` |
| Export | `Download` |
| Add/Create | `Plus` |
| Edit | `Pencil` |
| Delete/Cancel | `X` |
| View Detail | `Eye` |
| Assign | `UserPlus` |
| Print | `Printer` |
| Upload | `Upload` |
| Notification | `Bell` |
| AI Draft | `Sparkles` |
| Dark Mode | `Moon` / `Sun` |
| Language | `Globe` |
| Logout | `LogOut` |
| Pending | `Clock` |
| Resolved | `CheckCircle` |
| Rejected | `XCircle` |
| High Priority | `AlertTriangle` |

---

## 10. Animations & Transitions

### 10A. Transition Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--transition-fast` | `120ms ease` | Hover states, color changes |
| `--transition-base` | `200ms ease` | Button presses, input focus, opacity |
| `--transition-slow` | `300ms ease` | Sidebar expand/collapse, modal open/close |
| `--transition-spring` | `500ms cubic-bezier(0.34, 1.56, 0.64, 1)` | Toast slide-in, dropdown appear |

### 10B. Animation Keyframes

```css
/* Fade In — modals, overlays */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Scale In — modals, popovers */
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

/* Slide In Right — sidebar overlay on mobile */
@keyframes slideInRight {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

/* Slide In Down — dropdown menus */
@keyframes slideInDown {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Pulse — loading indicators, notification badge */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Skeleton shimmer — loading states */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

### 10C. Loading States

| Component | Loading Behavior |
|-----------|-----------------|
| Table | 8 skeleton rows with shimmer animation |
| KPI Cards | Gray skeleton card with shimmer |
| Charts | Full chart area skeleton with shimmer |
| Button (submitting) | Text replaced with spinner, `pointer-events: none` |
| Page transition | Fade between pages (`200ms`) |
| Search results | Debounced `300ms`, subtle spinner in search input |

### 10D. Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 11. Accessibility Standards

| Standard | Implementation |
|----------|---------------|
| **Contrast** | WCAG AA minimum — all text/background combinations ≥ 4.5:1 (normal text), ≥ 3:1 (large text) |
| **Focus Indicators** | All interactive elements have visible focus outlines (`2px solid --color-primary-400, offset: 2px`) |
| **Keyboard Navigation** | Full tab-order for all forms, modals, dropdowns, and tables |
| **ARIA Labels** | All icon-only buttons have `aria-label`. All form inputs have associated `<label>`. Status badges have `role="status"`. |
| **Screen Reader** | Toast notifications use `aria-live="polite"`. Error messages use `aria-live="assertive"`. |
| **Color Independence** | Status is never communicated by color alone — always paired with text label and/or icon |
| **Touch Targets** | Minimum `44px × 44px` for mobile touch targets |

---

## 12. Chart Theming (Recharts + D3)

> Per TECH_STACK.md — Recharts for standard charts, D3.js for advanced visuals.

### 12A. Chart Color Palette

Sequential color scale for multi-series charts (ordered by visual weight):

| Index | Color | Token |
|:-----:|-------|-------|
| 1 | `#1B3A5C` | `--chart-1` (primary navy) |
| 2 | `#2563EB` | `--chart-2` (blue) |
| 3 | `#16A34A` | `--chart-3` (green) |
| 4 | `#D97706` | `--chart-4` (amber) |
| 5 | `#7C3AED` | `--chart-5` (purple) |
| 6 | `#EA580C` | `--chart-6` (orange) |
| 7 | `#DC2626` | `--chart-7` (red) |
| 8 | `#0891B2` | `--chart-8` (cyan) |

### 12B. Chart Styling Rules

| Property | Value |
|----------|-------|
| Background | Transparent (inherits card bg) |
| Grid Lines | `--color-gray-200` (light) / `--color-gray-300` (dark), `strokeDasharray: "3 3"` |
| Axis Labels | `--text-xs`, `--color-gray-500` |
| Axis Lines | `--color-gray-300` |
| Tooltip BG | `--bg-card` with `--shadow-md` |
| Tooltip Border | `1px solid --border-default` |
| Tooltip Text | `--text-sm`, `--color-gray-900` |
| Legend | Bottom-center, `--text-xs`, `--color-gray-600` |
| Bar Radius | `2px` top corners |
| Line Stroke Width | `2px` |
| Dot Size | `4px` (default), `6px` (hover) |
| Animation | `animationDuration: 800`, `animationEasing: "ease-out"` |

---

## 13. Z-Index Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--z-base` | `0` | Normal flow |
| `--z-sticky` | `100` | Sticky table headers |
| `--z-sidebar` | `200` | Sidebar |
| `--z-topbar` | `300` | Top navigation bar |
| `--z-dropdown` | `400` | Dropdown menus, popovers |
| `--z-modal-backdrop` | `500` | Modal overlay |
| `--z-modal` | `600` | Modal dialog |
| `--z-toast` | `700` | Toast notifications |
| `--z-tooltip` | `800` | Tooltips |
| `--z-command` | `900` | Command palette / global search overlay |

---

## 14. Print Styles

When printing reports, receipts, or letters:

```css
@media print {
  /* Hide non-printable elements */
  .sidebar,
  .topbar,
  .toast-container,
  .no-print { display: none !important; }
  
  /* Reset for print */
  body {
    background: white !important;
    color: black !important;
    font-size: 12pt;
  }
  
  /* Full width */
  .main-content {
    margin: 0 !important;
    padding: 0 !important;
    max-width: 100% !important;
  }
  
  /* Page breaks */
  .page-break { page-break-before: always; }
  table { page-break-inside: avoid; }
  tr { page-break-inside: avoid; }
  
  /* Links */
  a { color: black !important; text-decoration: underline; }
}
```

---

## 15. CSS Custom Properties — Master Reference

Below is the complete root-level CSS variable definition file to be placed in `/src/styles/design-tokens.css` and imported globally.

```css
/* ================================================================
   MLA E-Office — Design System Tokens
   Source of truth: UI_DESIGN_SYSTEM.md
   ================================================================ */

:root {
  /* ---- Font Families ---- */
  --font-family-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-family-marathi: 'Noto Sans Devanagari', 'Mangal', 'Devanagari MT', sans-serif;
  --font-family-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;

  /* ---- Font Sizes ---- */
  --text-2xs: 0.625rem;
  --text-xs: 0.75rem;
  --text-sm: 0.8125rem;
  --text-base: 0.875rem;
  --text-md: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;

  /* ---- Font Weights ---- */
  --font-light: 300;
  --font-regular: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;

  /* ---- Spacing (8px grid) ---- */
  --space-0: 0;
  --space-0-5: 0.125rem;
  --space-1: 0.25rem;
  --space-1-5: 0.375rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;

  /* ---- Border Radius (Sharp) ---- */
  --radius-none: 0;
  --radius-sm: 2px;
  --radius-base: 3px;
  --radius-md: 4px;
  --radius-full: 9999px;

  /* ---- Transitions ---- */
  --transition-fast: 120ms ease;
  --transition-base: 200ms ease;
  --transition-slow: 300ms ease;
  --transition-spring: 500ms cubic-bezier(0.34, 1.56, 0.64, 1);

  /* ---- Layout ---- */
  --layout-topbar-height: 56px;
  --layout-sidebar-expanded: 240px;
  --layout-sidebar-collapsed: 64px;
  --layout-content-max-width: 1440px;
  --layout-content-padding: 24px;
  --layout-page-header-height: 64px;

  /* ---- Z-Index ---- */
  --z-base: 0;
  --z-sticky: 100;
  --z-sidebar: 200;
  --z-topbar: 300;
  --z-dropdown: 400;
  --z-modal-backdrop: 500;
  --z-modal: 600;
  --z-toast: 700;
  --z-tooltip: 800;
  --z-command: 900;

  /* ---- Breakpoints (for JS reference — use @media in CSS) ---- */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;

  /* ---- Primary Colors (Navy) ---- */
  --color-primary-50: #EFF4F9;
  --color-primary-100: #D6E4F0;
  --color-primary-200: #ADC9E0;
  --color-primary-300: #7BAAC8;
  --color-primary-400: #4A8BB0;
  --color-primary-500: #1B6B98;
  --color-primary-600: #1B3A5C;
  --color-primary-700: #152E49;
  --color-primary-800: #102337;
  --color-primary-900: #0A1724;

  /* ---- Accent Colors (Amber) ---- */
  --color-accent-50: #FFF8E1;
  --color-accent-100: #FFECB3;
  --color-accent-200: #FFE082;
  --color-accent-300: #FFD54F;
  --color-accent-400: #FFCA28;
  --color-accent-500: #FFC107;
  --color-accent-600: #FFB300;
  --color-accent-700: #FF8F00;

  /* ---- Neutral / Gray ---- */
  --color-gray-0: #FFFFFF;
  --color-gray-25: #FAFBFC;
  --color-gray-50: #F5F7FA;
  --color-gray-100: #EDF0F5;
  --color-gray-200: #DDE3EB;
  --color-gray-300: #C5CED8;
  --color-gray-400: #94A3B8;
  --color-gray-500: #64748B;
  --color-gray-600: #475569;
  --color-gray-700: #334155;
  --color-gray-800: #1E293B;
  --color-gray-900: #0F172A;

  /* ---- Semantic Colors ---- */
  --color-success: #16A34A;
  --color-success-bg: #F0FDF4;
  --color-success-border: #BBF7D0;

  --color-warning: #D97706;
  --color-warning-bg: #FFFBEB;
  --color-warning-border: #FDE68A;

  --color-error: #DC2626;
  --color-error-bg: #FEF2F2;
  --color-error-border: #FECACA;

  --color-info: #2563EB;
  --color-info-bg: #EFF6FF;
  --color-info-border: #BFDBFE;

  --color-purple: #7C3AED;
  --color-purple-bg: #F5F3FF;
  --color-purple-border: #DDD6FE;

  --color-orange: #EA580C;
  --color-orange-bg: #FFF7ED;
  --color-orange-border: #FED7AA;

  --color-neutral: #6B7280;
  --color-neutral-bg: #F3F4F6;
  --color-neutral-border: #D1D5DB;

  /* ---- Chart Colors ---- */
  --chart-1: #1B3A5C;
  --chart-2: #2563EB;
  --chart-3: #16A34A;
  --chart-4: #D97706;
  --chart-5: #7C3AED;
  --chart-6: #EA580C;
  --chart-7: #DC2626;
  --chart-8: #0891B2;

  /* ---- Semantic Surface Aliases (Light Mode) ---- */
  --bg-page: var(--color-gray-50);
  --bg-card: var(--color-gray-0);
  --bg-sidebar: var(--color-primary-600);
  --bg-topbar: var(--color-gray-0);
  --bg-input: var(--color-gray-0);
  --bg-table-header: var(--color-gray-50);
  --bg-table-row-alt: var(--color-gray-25);
  --bg-table-row-hover: var(--color-primary-50);

  --text-primary: var(--color-gray-900);
  --text-secondary: var(--color-gray-600);
  --text-muted: var(--color-gray-500);
  --text-disabled: var(--color-gray-400);
  --text-on-primary: #FFFFFF;
  --text-link: var(--color-primary-600);

  --border-default: var(--color-gray-200);
  --border-strong: var(--color-gray-300);
  --border-focus: var(--color-primary-500);

  /* ---- Shadows (Light Mode) ---- */
  --shadow-none: none;
  --shadow-xs: 0 1px 2px rgba(15,23,42,0.05);
  --shadow-sm: 0 1px 3px rgba(15,23,42,0.08), 0 1px 2px rgba(15,23,42,0.04);
  --shadow-md: 0 4px 6px rgba(15,23,42,0.07), 0 2px 4px rgba(15,23,42,0.04);
  --shadow-lg: 0 10px 15px rgba(15,23,42,0.08), 0 4px 6px rgba(15,23,42,0.04);
  --shadow-xl: 0 20px 25px rgba(15,23,42,0.1), 0 8px 10px rgba(15,23,42,0.04);
  --shadow-sidebar: 2px 0 8px rgba(15,23,42,0.06);
}

/* ================================================================
   DARK MODE OVERRIDES
   ================================================================ */

[data-theme="dark"] {
  /* Primary Colors */
  --color-primary-50: #0D1B2A;
  --color-primary-100: #122640;
  --color-primary-200: #1A3355;
  --color-primary-300: #234A75;
  --color-primary-400: #2D6295;
  --color-primary-500: #3A7DB8;
  --color-primary-600: #5A9BD5;
  --color-primary-700: #7AB3E0;
  --color-primary-800: #9ECBE8;
  --color-primary-900: #C2DFF0;

  /* Accent Colors */
  --color-accent-50: #1A1400;
  --color-accent-100: #2E2400;
  --color-accent-200: #473800;
  --color-accent-300: #614E00;
  --color-accent-400: #7A6300;
  --color-accent-500: #947800;
  --color-accent-600: #B89200;
  --color-accent-700: #D4A800;

  /* Neutral / Gray */
  --color-gray-0: #0F1419;
  --color-gray-25: #131A22;
  --color-gray-50: #1A2332;
  --color-gray-100: #1F2D3D;
  --color-gray-200: #2A3A4E;
  --color-gray-300: #3A4D63;
  --color-gray-400: #4F6479;
  --color-gray-500: #6B8299;
  --color-gray-600: #8EA3B8;
  --color-gray-700: #A8BDD1;
  --color-gray-800: #C5D5E4;
  --color-gray-900: #E2ECF4;

  /* Semantic Colors */
  --color-success: #22C55E;
  --color-success-bg: #052E16;
  --color-success-border: #166534;

  --color-warning: #F59E0B;
  --color-warning-bg: #2E1D05;
  --color-warning-border: #78350F;

  --color-error: #EF4444;
  --color-error-bg: #2E0505;
  --color-error-border: #7F1D1D;

  --color-info: #3B82F6;
  --color-info-bg: #0C1929;
  --color-info-border: #1E3A5F;

  --color-purple: #A78BFA;
  --color-purple-bg: #1E0A3E;
  --color-purple-border: #4C1D95;

  --color-orange: #F97316;
  --color-orange-bg: #2E1505;
  --color-orange-border: #7C2D12;

  --color-neutral: #9CA3AF;
  --color-neutral-bg: #1F2937;
  --color-neutral-border: #374151;

  /* Surface Aliases */
  --bg-page: #0F1419;
  --bg-card: #1A2332;
  --bg-sidebar: #0D1B2A;
  --bg-topbar: #131A22;
  --bg-input: #1F2D3D;
  --bg-table-header: #1F2D3D;
  --bg-table-row-alt: #131A22;
  --bg-table-row-hover: rgba(90,155,213,0.08);

  --text-primary: #C5D5E4;
  --text-secondary: #6B8299;
  --text-muted: #4F6479;
  --text-disabled: #4F6479;
  --text-link: #5A9BD5;

  --border-default: #2A3A4E;
  --border-strong: #3A4D63;
  --border-focus: #3A7DB8;

  /* Shadows */
  --shadow-xs: 0 1px 2px rgba(0,0,0,0.3);
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.2);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.2);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.5), 0 4px 6px rgba(0,0,0,0.3);
  --shadow-xl: 0 20px 25px rgba(0,0,0,0.6), 0 8px 10px rgba(0,0,0,0.3);
  --shadow-sidebar: 2px 0 8px rgba(0,0,0,0.4);
}
```

---

## 16. File Organization

Place design system files in the web frontend project:

```
web/src/
├── styles/
│   ├── design-tokens.css       ← All CSS custom properties (from Section 15 above)
│   ├── reset.css               ← CSS reset / normalize
│   ├── global.css              ← Base element styles (body, a, headings, etc.)
│   ├── animations.css          ← Keyframe animations (from Section 10B)
│   ├── print.css               ← Print styles (from Section 14)
│   └── utilities.css           ← Utility classes (.sr-only, .no-print, .truncate, etc.)
├── components/
│   ├── Button/
│   │   ├── Button.jsx
│   │   └── Button.module.css
│   ├── Badge/
│   │   ├── Badge.jsx
│   │   └── Badge.module.css
│   ├── Table/
│   │   ├── DataTable.jsx
│   │   └── DataTable.module.css
│   ├── Modal/
│   │   ├── Modal.jsx
│   │   └── Modal.module.css
│   ├── Card/
│   │   ├── Card.jsx
│   │   └── Card.module.css
│   ├── Input/
│   │   ├── TextInput.jsx
│   │   ├── SelectInput.jsx
│   │   ├── FileUpload.jsx
│   │   └── Input.module.css
│   ├── Layout/
│   │   ├── AppShell.jsx
│   │   ├── Sidebar.jsx
│   │   ├── TopBar.jsx
│   │   └── Layout.module.css
│   ├── KpiCard/
│   │   ├── KpiCard.jsx
│   │   └── KpiCard.module.css
│   └── EmptyState/
│       ├── EmptyState.jsx
│       └── EmptyState.module.css
└── index.css                   ← Imports: design-tokens → reset → global → animations
```

Import order in `index.css`:

```css
@import './styles/design-tokens.css';
@import './styles/reset.css';
@import './styles/global.css';
@import './styles/animations.css';
@import './styles/print.css';
@import './styles/utilities.css';
```

---

## 17. Quick Reference — Status Color Cheat Sheet

A one-glance reference for developers implementing status badges across all modules.

```
╔═══════════════════════════════════════════════════════════════════════╗
║                   STATUS COLOR QUICK REFERENCE                       ║
╠══════════════════════╦═══════════╦════════════╦═══════════════════════╣
║  STATUS              ║  COLOR    ║  HEX       ║  CSS VARIABLE         ║
╠══════════════════════╬═══════════╬════════════╬═══════════════════════╣
║  PENDING             ║  Amber    ║  #D97706   ║  --color-warning      ║
║  IN_PROGRESS         ║  Blue     ║  #2563EB   ║  --color-info         ║
║  ASSIGNED            ║  Blue     ║  #2563EB   ║  --color-info         ║
║  FORWARDED           ║  Orange   ║  #EA580C   ║  --color-orange       ║
║  AWAITING_RESPONSE   ║  Purple   ║  #7C3AED   ║  --color-purple       ║
║  RESOLVED            ║  Green    ║  #16A34A   ║  --color-success      ║
║  COMPLETED           ║  Green    ║  #16A34A   ║  --color-success      ║
║  REJECTED            ║  Red      ║  #DC2626   ║  --color-error        ║
║  DELAYED             ║  Red      ║  #DC2626   ║  --color-error        ║
║  CANCELLED           ║  Gray     ║  #6B7280   ║  --color-neutral      ║
║  ARCHIVED            ║  Gray     ║  #6B7280   ║  --color-neutral      ║
║  SANCTIONED          ║  Blue     ║  #2563EB   ║  --color-info         ║
╠══════════════════════╬═══════════╬════════════╬═══════════════════════╣
║  HIGH PRIORITY       ║  Red      ║  #DC2626   ║  --color-error        ║
║  MEDIUM PRIORITY     ║  Amber    ║  #D97706   ║  --color-warning      ║
║  LOW PRIORITY        ║  Green    ║  #16A34A   ║  --color-success      ║
╚══════════════════════╩═══════════╩════════════╩═══════════════════════╝
```

---

*Last Updated: August 2026*
*Version: 1.0*
*Maintained by: AI Agent — reference this document before generating any UI code.*
