# MLA E-Office — Component Library

> **Complete Reusable UI Component Specifications — Props, Variants, Visual Specs, and React Usage Examples**
> 
> Every React component in the MLA E-Office frontend is documented here. This is the developer's reference for building consistent, production-ready UI across all 13 modules.
> 
> *Related Documents:* [UI_DESIGN_SYSTEM.md](file:///s:/MLA%20E%20-%20Office/UI_DESIGN_SYSTEM.md) | [NAVIGATION_MAP.md](file:///s:/MLA%20E%20-%20Office/NAVIGATION_MAP.md) | [TECH_STACK.md](file:///s:/MLA%20E%20-%20Office/TECH_STACK.md) | [MASTER_DATA.md](file:///s:/MLA%20E%20-%20Office/MASTER_DATA.md)
> 
> **Dark Mode:** All components inherit dark mode styling from CSS Custom Properties defined in `UI_DESIGN_SYSTEM.md` Section 7. No component-level dark mode overrides are needed.

---

## Component Index (21 Components)

| # | Component | Category | Used In |
|---|-----------|----------|---------|
| 1 | [PageHeader](#1-pageheader) | Layout | Every page |
| 2 | [Breadcrumb](#2-breadcrumb) | Navigation | Every page (except Dashboard) |
| 3 | [Tabs](#3-tabs) | Navigation | Inward/Outward, Nivedan list, WhatsApp, Settings |
| 4 | [DataTable](#4-datatable) | Data Display | Inward, Nivedan, Visitor, User Mgmt |
| 5 | [FilterBar](#5-filterbar) | Data Controls | Inward, Nivedan, Karyakarta, Dev Works |
| 6 | [Pagination](#6-pagination) | Data Controls | All list pages |
| 7 | [SearchBar](#7-searchbar) | Data Controls | Topbar (global), all list pages (local) |
| 8 | [FormField](#8-formfield) | Form | All forms |
| 9 | [FileUploadZone](#9-fileuploadzone) | Form | Inward, Nivedan, Dev Works |
| 10 | [StatusBadge](#10-statusbadge) | Data Display | Nivedan, Inward, Dev Works, Priority |
| 11 | [KPICard](#11-kpicard) | Data Display | Dashboard, list page summaries |
| 12 | [AvatarInitials](#12-avatarinitials) | Data Display | Topbar, User Mgmt, Karyakarta, Visitor |
| 13 | [ProgressBar](#13-progressbar) | Data Display | Dev Works detail, milestones |
| 14 | [Timeline](#14-timeline) | Data Display | Nivedan detail, audit trail |
| 15 | [TreeView](#15-treeview) | Data Display | Booth structure |
| 16 | [Modal](#16-modal) | Overlay | Confirmations, quick forms, detail views |
| 17 | [Toast](#17-toast) | Feedback | Global — success/error/warning/info |
| 18 | [EmptyState](#18-emptystate) | Feedback | All list pages when no data |
| 19 | [SkeletonLoader](#19-skeletonloader) | Feedback | All pages during data fetch |
| 20 | [DropdownMenu](#20-dropdownmenu) | Navigation | Avatar menu, row actions, bulk actions |
| 21 | [DateNavigator](#21-datenavigator) | Data Controls | Visitor Book |

---

## 1. PageHeader

The top-of-page component with title, subtitle, breadcrumb, and action buttons. Present on every page.

### Visual Structure

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Breadcrumb: Dashboard / Nivedans                                        │
│                                                                          │
│  📝 Nivedans · निवेदने                          [+ New Nivedan] [Export] │
│  Manage citizen complaints and petitions                                │
└──────────────────────────────────────────────────────────────────────────┘
```

### Props Interface

```typescript
interface PageHeaderProps {
  title: string;                        // English page title
  titleMr?: string;                     // Marathi title (shown after ·)
  subtitle?: string;                    // Description below title
  icon?: LucideIcon;                    // Lucide icon before title
  breadcrumbs: BreadcrumbItem[];        // See Breadcrumb component
  actions?: React.ReactNode;            // Right-aligned action buttons
  children?: React.ReactNode;           // Optional content below (e.g., tabs, stats)
}

interface BreadcrumbItem {
  label: string;
  href?: string;                        // If undefined, renders as plain text (current page)
}
```

### Visual Specs

| Property | Value |
|----------|-------|
| Title Font | `--text-2xl` (24px), `--font-bold` |
| Title Marathi | `--font-family-marathi`, same size |
| Subtitle Font | `--text-sm` (13px), `--color-gray-500` |
| Icon Size | `24px`, `--color-primary-400` |
| Action Buttons Gap | `--space-2` (8px) |
| Bottom Margin | `--space-6` (24px) |
| Vertical Spacing | Title to subtitle: `--space-1` (4px) |

### Usage Example

```jsx
<PageHeader
  icon={FileText}
  title="Nivedans"
  titleMr="निवेदने"
  subtitle="Manage citizen complaints and petitions"
  breadcrumbs={[
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Nivedans' }
  ]}
  actions={
    <>
      <Button variant="ghost" icon={Download}>Export</Button>
      <Button variant="primary" icon={Plus}>New Nivedan</Button>
    </>
  }
/>
```

---

## 2. Breadcrumb

Navigational trail showing the current page hierarchy. Clickable for parent links, plain text for current page.

### Props Interface

```typescript
interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: string;                   // Default: "/"
}

interface BreadcrumbItem {
  label: string;
  href?: string;                        // Omit for current page (last item)
  icon?: LucideIcon;                    // Optional icon before label
}
```

### Visual Specs

| Property | Value |
|----------|-------|
| Font Size | `--text-xs` (12px) |
| Link Color | `--color-primary-600` |
| Current (no link) Color | `--color-gray-500` |
| Separator Color | `--color-gray-400` |
| Separator | `/` character with `0 6px` padding |
| Item Gap | `--space-1.5` (6px) |
| Max Depth | 3 levels |
| Truncation (mobile) | Show last 2 items only, with `...` prefix |

### Usage Example

```jsx
<Breadcrumb items={[
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Inward & Outward', href: '/inward' },
  { label: 'INW-2026-0389' }
]} />
```

### Breadcrumb Rendering Rules

| Rule | Detail |
|------|--------|
| Last item is always plain text | Never a link |
| ID pages show the actual ID | `NIV-2026-01247`, not "Detail" |
| Use module name, not pillar name | `Nivedans`, not `Public Grievances` |
| Detail/Edit pages show entity title | `Ramesh Patil`, `NH-4 Road Widening` |

---

## 3. Tabs

Horizontal tab bar for switching between related views on a single page.

### Props Interface

```typescript
interface TabsProps {
  tabs: TabItem[];
  activeTab: string;                    // Tab id
  onChange: (tabId: string) => void;
  variant?: 'underline' | 'pill';       // Default: 'underline'
}

interface TabItem {
  id: string;
  label: string;
  labelMr?: string;                     // Marathi label
  icon?: LucideIcon;
  badge?: number | string;              // Count badge (e.g., pending count)
  disabled?: boolean;
}
```

### Visual Specs — Underline Variant (Default)

| Property | Value |
|----------|-------|
| Tab Height | `40px` |
| Tab Padding | `0 16px` |
| Font Size | `--text-sm` (13px), `--font-medium` |
| Default Color | `--color-gray-500` |
| Active Color | `--color-primary-600` |
| Active Indicator | `2px solid --color-primary-600` bottom border |
| Hover Color | `--color-gray-700` |
| Badge | Status badge style (see StatusBadge), positioned right of label with `6px` gap |
| Container Border | `1px solid --color-gray-200` bottom border |
| Transition | `--transition-fast` (120ms) |

### Visual Specs — Pill Variant

| Property | Value |
|----------|-------|
| Tab Padding | `6px 14px` |
| Border Radius | `--radius-base` (3px) |
| Active Background | `--color-primary-600` |
| Active Text | `#FFFFFF` |
| Default Background | `transparent` |
| Default Border | `1px solid --color-gray-200` |
| Border collapse | Adjacent tabs share borders (no double borders) |

### Usage Example

```jsx
<Tabs
  activeTab="inward"
  onChange={setActiveTab}
  tabs={[
    { id: 'inward', label: 'Inward', labelMr: 'आवक', icon: Mail, badge: 389 },
    { id: 'outward', label: 'Outward', labelMr: 'जावक', icon: Send, badge: 156 }
  ]}
/>
```

### Where Used

| Page | Tabs | Variant |
|------|------|---------|
| Inward/Outward list | Inward, Outward | Underline |
| Nivedan list | All, Pending, In Progress, Forwarded, Resolved, Rejected | Underline |
| WhatsApp module | Overview, Broadcasts, Templates, Delivery Log, Greetings | Underline |
| Calendar | Month, Week, Day | Pill |
| Settings | Profile, Office Info, Integrations, Security | Underline |

---

## 4. DataTable

The primary data display component. Sortable, paginated, with row actions.

### Props Interface

```typescript
interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  isLoading?: boolean;                  // Shows SkeletonLoader
  emptyState?: EmptyStateProps;         // Shown when data.length === 0
  pagination?: PaginationProps;         // Pagination controls
  onRowClick?: (row: T) => void;        // Row click handler (navigates to detail)
  stickyHeader?: boolean;              // Default: true
  stripedRows?: boolean;               // Alternate row backgrounds. Default: false
  selectable?: boolean;                // Checkbox column for bulk actions
  selectedRows?: string[];             // Array of selected row IDs
  onSelectionChange?: (ids: string[]) => void;
  rowActions?: (row: T) => RowAction[];  // Per-row action buttons
}

interface ColumnDef<T> {
  id: string;
  header: string;                       // English column header
  headerMr?: string;                    // Marathi column header
  accessorKey: keyof T;                 // Data field key
  cell?: (row: T) => React.ReactNode;   // Custom cell renderer
  sortable?: boolean;                   // Default: false
  width?: string;                       // e.g., '120px', '20%'
  align?: 'left' | 'center' | 'right'; // Default: 'left'
  hideOnMobile?: boolean;               // Hidden below 768px
}

interface RowAction {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'danger';
}
```

### Visual Specs

| Property | Value |
|----------|-------|
| Header BG | `--color-gray-50` |
| Header Text | `--text-xs` (12px), `--font-semibold`, `uppercase`, `letter-spacing: 0.5px`, `--color-gray-600` |
| Header Bottom Border | `2px solid --color-gray-200` |
| Row Height | `44px` minimum |
| Row Border Bottom | `1px solid --color-gray-100` |
| Row Hover BG | `--color-primary-50` |
| Striped Row BG | `--color-gray-25` (even rows) |
| Cell Padding | `12px 16px` |
| Cell Text | `--text-base` (14px), `--color-gray-900` |
| Clickable Row | `cursor: pointer` |
| Sort Arrow | `↑` / `↓` icon beside header text, `--color-gray-400` (inactive), `--color-primary-600` (active) |
| Selected Row BG | `--color-primary-50` with `2px solid --color-primary-400` left border |
| Checkbox | `16px × 16px`, `--radius-sm` (2px), accent color: `--color-primary-600` |
| Sticky Header | `position: sticky; top: 0; z-index: var(--z-sticky)` |
| Action Buttons | `28px × 28px` ghost icon buttons with `--radius-base` |
| Loading State | 8 skeleton rows with shimmer animation |
| Empty State | Centered EmptyState component |

### Usage Example

```jsx
<DataTable
  columns={[
    { id: 'trackingId', header: 'Tracking ID', accessorKey: 'trackingId',
      cell: (row) => <span className="mono">{row.trackingId}</span>, sortable: true },
    { id: 'citizen', header: 'Citizen', accessorKey: 'citizenName', sortable: true },
    { id: 'category', header: 'Category', accessorKey: 'categoryName' },
    { id: 'status', header: 'Status', accessorKey: 'status',
      cell: (row) => <StatusBadge status={row.status} module="nivedan" /> },
    { id: 'date', header: 'Date', accessorKey: 'createdAt', sortable: true,
      cell: (row) => dayjs(row.createdAt).format('DD/MM/YYYY') },
    { id: 'priority', header: 'Priority', accessorKey: 'priority',
      cell: (row) => <StatusBadge status={row.priority} module="priority" />, hideOnMobile: true }
  ]}
  data={nivedans}
  isLoading={isLoading}
  onRowClick={(row) => navigate(`/nivedans/${row.id}`)}
  pagination={{ page, pageSize: 25, total: 342, onChange: setPage }}
  rowActions={(row) => [
    { icon: Eye, label: 'View', onClick: () => navigate(`/nivedans/${row.id}`) },
    { icon: Pencil, label: 'Edit', onClick: () => navigate(`/nivedans/${row.id}/edit`) },
    { icon: Printer, label: 'Print', onClick: () => printReceipt(row.id) }
  ]}
/>
```

### Mobile Behavior

On screens `< 768px`, the table switches to a **card/list layout**:
- Each row becomes a stacked card
- Column headers become inline labels
- `hideOnMobile` columns are removed
- Row actions move to a `...` dropdown

---

## 5. FilterBar

Horizontal panel with filter dropdowns, search input, and reset button. Appears above DataTable.

### Props Interface

```typescript
interface FilterBarProps {
  filters: FilterDef[];
  values: Record<string, any>;          // Current filter values
  onChange: (key: string, value: any) => void;
  onReset: () => void;
  searchPlaceholder?: string;           // Local search input placeholder
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

interface FilterDef {
  key: string;
  label: string;                        // English label
  labelMr?: string;                     // Marathi label
  type: 'select' | 'date' | 'dateRange' | 'multiSelect';
  options?: { value: string; label: string; labelMr?: string }[];
  placeholder?: string;
}
```

### Visual Specs

| Property | Value |
|----------|-------|
| Container BG | `--bg-card` |
| Container Border | `1px solid --color-gray-200` |
| Container Radius | `--radius-base` (3px) |
| Container Padding | `12px` |
| Container Shadow | `--shadow-sm` |
| Layout | `display: flex; flex-wrap: wrap; gap: 10px; align-items: flex-end` |
| Filter Label | `--text-2xs` (10px), `--font-semibold`, `--color-gray-400`, `uppercase`, `letter-spacing: 0.5px` |
| Filter Input Height | `30px` |
| Filter Input Min Width | `130px` |
| Search Input Min Width | `180px` |
| Reset Button | Ghost button, `--text-xs`, `--color-gray-500` |
| Mobile | Wraps to multiple rows; collapses to "Filters" dropdown on `< 640px` |

### Usage Example

```jsx
<FilterBar
  searchPlaceholder="Search by name, mobile, ID..."
  searchValue={search}
  onSearchChange={setSearch}
  values={filters}
  onChange={(key, val) => setFilters(prev => ({ ...prev, [key]: val }))}
  onReset={() => setFilters({})}
  filters={[
    { key: 'status', label: 'Status', type: 'select',
      options: [
        { value: 'PENDING', label: 'Pending', labelMr: 'प्रलंबित' },
        { value: 'IN_PROGRESS', label: 'In Progress', labelMr: 'सुरू' },
        { value: 'RESOLVED', label: 'Resolved', labelMr: 'निकाली' }
      ]
    },
    { key: 'category', label: 'Category', type: 'select', options: categories },
    { key: 'dateRange', label: 'Date Range', type: 'dateRange' },
    { key: 'priority', label: 'Priority', type: 'select',
      options: [
        { value: 'HIGH', label: 'High' },
        { value: 'MEDIUM', label: 'Medium' },
        { value: 'LOW', label: 'Low' }
      ]
    }
  ]}
/>
```

---

## 6. Pagination

Table pagination controls with page info and navigation.

### Props Interface

```typescript
interface PaginationProps {
  page: number;                         // Current page (1-indexed)
  pageSize: number;                     // Rows per page
  total: number;                        // Total row count
  onChange: (page: number) => void;
  pageSizeOptions?: number[];           // Default: [10, 25, 50, 100]
  onPageSizeChange?: (size: number) => void;
}
```

### Visual Structure

```
Showing 1-25 of 342         [10 ▾]  rows/page       ‹  1  2  3  ...  14  ›
```

### Visual Specs

| Property | Value |
|----------|-------|
| Container | `display: flex; justify-content: space-between; align-items: center` |
| Info Text | `--text-xs` (12px), `--color-gray-500` — "Showing 1-25 of 342" |
| Page Button Size | `28px × 28px` |
| Page Button Font | `--text-xs`, `--font-medium` |
| Active Page BG | `--color-primary-600`, `color: #fff` |
| Default Page BG | `transparent`, border: `1px solid --color-gray-200` |
| Hover | `--color-gray-50` background |
| Disabled (‹/›) | `opacity: 0.4; cursor: not-allowed` |
| Page Size Selector | Small select input, `height: 28px` |
| Gap between buttons | `4px` |
| Ellipsis | `...` rendered as plain text, no click |
| Margin Top | `--space-4` (16px) from table |

---

## 7. SearchBar

Two variants: **Global** (topbar, searches all modules) and **Local** (page-level, searches current table).

### Props Interface

```typescript
interface SearchBarProps {
  variant: 'global' | 'local';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;                  // Default: 300
  results?: SearchResultGroup[];        // Global variant only
  isLoading?: boolean;
  onResultClick?: (result: SearchResult) => void;
}

interface SearchResultGroup {
  module: string;                       // e.g., "Nivedans", "Visitors"
  moduleIcon: LucideIcon;
  items: SearchResult[];
}

interface SearchResult {
  id: string;
  title: string;                        // Primary text (name, subject)
  subtitle: string;                     // Secondary text (date, status)
  href: string;                         // Navigation target
}
```

### Visual Specs — Global Variant

| Property | Value |
|----------|-------|
| Container | Centered in topbar, `min-width: 400px`, `max-width: 520px` |
| Height | `36px` |
| Background | `--color-gray-50` |
| Border | `1px solid --color-gray-200` |
| Border (focus) | `1px solid --color-primary-500` |
| Border Radius | `--radius-base` (3px) |
| Icon | `Search` (Lucide), `16px`, `--color-gray-400`, left-positioned |
| Placeholder | `--text-sm`, `--color-gray-400` — "Search nivedans, visitors, inward..." |
| Dropdown | Appears on typing ≥2 chars, `max-height: 400px`, `--shadow-xl` |
| Result Group Header | `--text-2xs` (10px), `--font-semibold`, `uppercase`, `--color-gray-400` |
| Result Item | `padding: 8px 12px`, hover: `--color-primary-50` |
| Result Title | `--text-sm`, `--font-medium`, `--color-gray-900` |
| Result Subtitle | `--text-xs`, `--color-gray-500` |
| "View all" link | Bottom of dropdown, `--text-xs`, `--color-primary-600` |
| Keyboard | `↑`/`↓` to navigate results, `Enter` to select, `Esc` to close |
| Mobile (`< 768px`) | Collapses to search icon; tap expands to full-width overlay |

### Visual Specs — Local Variant

| Property | Value |
|----------|-------|
| Height | `30px` |
| Min Width | `180px` |
| Background | `--color-gray-50` |
| Border | `1px solid --color-gray-200` |
| No dropdown | Filters the current table directly (debounced) |

---

## 8. FormField

Universal form field component supporting all input types. Wraps `react-hook-form` fields with consistent label, error, and helper text styling.

### Props Interface

```typescript
interface FormFieldProps {
  name: string;                         // react-hook-form field name
  label: string;
  labelMr?: string;                     // Marathi label
  type: 'text' | 'email' | 'tel' | 'number' | 'password' | 'textarea' | 'select' | 
        'multiSelect' | 'date' | 'dateRange' | 'file' | 'checkbox' | 'radio';
  placeholder?: string;
  required?: boolean;                   // Shows red asterisk *
  disabled?: boolean;
  helperText?: string;                  // Below input
  options?: { value: string; label: string; labelMr?: string }[]; // For select/multiSelect/radio
  size?: 'sm' | 'md' | 'lg';           // Default: 'md'
  maxLength?: number;                   // Character limit with counter
  rows?: number;                        // Textarea rows. Default: 4
  accept?: string;                      // File input accept types
  maxFileSize?: number;                 // In MB
  prefix?: React.ReactNode;            // Input prefix (e.g., ₹, +91)
  suffix?: React.ReactNode;            // Input suffix (e.g., days, %)
}
```

### Visual Specs (Size: Medium — Default)

| Property | Value |
|----------|-------|
| Input Height | `36px` |
| Background | `--bg-card` |
| Border | `1px solid --color-gray-300` |
| Border (focus) | `1px solid --color-primary-500` + `box-shadow: 0 0 0 3px rgba(27,58,92,0.12)` |
| Border (error) | `1px solid --color-error` + `box-shadow: 0 0 0 3px rgba(220,38,38,0.1)` |
| Border Radius | `--radius-base` (3px) |
| Padding | `8px 12px` |
| Font Size | `--text-base` (14px) |
| Placeholder | `--color-gray-400` |
| Label | Above input, `--text-sm` (13px), `--font-medium`, `--color-gray-700` |
| Required Marker | Red `*` after label text |
| Helper Text | Below input, `--text-xs` (12px), `--color-gray-500` |
| Error Text | Below input, `--text-xs` (12px), `--color-error` |
| Disabled BG | `--color-gray-50`, `opacity: 0.6`, `cursor: not-allowed` |
| Character Counter | Right-aligned below input, `--text-2xs` (10px), `--color-gray-400` |

### Size Variants

| Size | Input Height | Font Size | Label Size |
|------|-------------|-----------|------------|
| `sm` | `28px` | `--text-xs` (12px) | `--text-2xs` (10px) |
| `md` | `36px` | `--text-base` (14px) | `--text-sm` (13px) |
| `lg` | `44px` | `--text-md` (16px) | `--text-base` (14px) |

### Type-Specific Behavior

| Type | Additional Behavior |
|------|-------------------|
| `textarea` | Resizable vertically only (`resize: vertical`), min-height from `rows` |
| `select` | Native `<select>` or custom dropdown; shows chevron down icon |
| `multiSelect` | Tag-style chips with × remove button; dropdown with checkboxes |
| `date` | Uses `react-datepicker`; format: `DD/MM/YYYY`; IST timezone |
| `tel` | Prefix `+91`, max 10 digits, numeric only |
| `number` | Prefix/suffix support (e.g., `₹`, `%`); Indian number format |
| `file` | Renders FileUploadZone (see component #9) |

### Usage Example

```jsx
<FormField
  name="citizenName"
  label="Citizen Name"
  labelMr="नागरिकाचे नाव"
  type="text"
  required
  placeholder="Enter full name"
/>

<FormField
  name="category"
  label="Category"
  labelMr="वर्ग"
  type="select"
  required
  options={[
    { value: 'WATER_SUPPLY', label: 'Water Supply', labelMr: 'पाणीपुरवठा' },
    { value: 'ROAD_DRAINAGE', label: 'Road / Drainage', labelMr: 'रस्ते / गटार' },
    { value: 'ELECTRICITY', label: 'Electricity', labelMr: 'वीजपुरवठा' }
  ]}
/>

<FormField
  name="budget"
  label="Budget"
  type="number"
  prefix="₹"
  suffix="Cr"
  placeholder="0.00"
/>
```

---

## 9. FileUploadZone

Drag-and-drop file upload area with preview. Uses `react-dropzone`.

### Props Interface

```typescript
interface FileUploadZoneProps {
  name: string;
  accept?: Record<string, string[]>;   // MIME type map, e.g., {'application/pdf': ['.pdf']}
  maxSize?: number;                     // Max file size in bytes (default: 10MB)
  maxFiles?: number;                    // Max number of files (default: 5)
  value?: UploadedFile[];               // Current files
  onChange: (files: UploadedFile[]) => void;
  helperText?: string;                  // e.g., "PDF, JPG, PNG — Max 10MB"
  previewType?: 'list' | 'grid';        // Default: 'list'
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;                         // bytes
  type: string;                         // MIME type
  url?: string;                         // Preview URL or Cloudinary URL
  progress?: number;                    // Upload progress 0-100
  status: 'uploading' | 'success' | 'error';
}
```

### Visual Specs

| Property | Value |
|----------|-------|
| Border | `2px dashed --color-gray-300` |
| Border (hover/drag) | `2px dashed --color-primary-500` |
| Background | `transparent` |
| Background (drag-over) | `--color-primary-50` |
| Border Radius | `--radius-md` (4px) |
| Min Height | `120px` |
| Icon | `Upload` (Lucide), `32px`, `--color-gray-400` |
| Text | `--text-sm`, `--color-gray-500` — "Drag & drop files here or click to browse" |
| Accepted Types | Shown as chips: `PDF`, `JPG`, `PNG` — `--text-2xs`, `--color-gray-400` |
| File Preview | Listed below zone: filename, size, status icon, progress bar, × remove |
| Progress Bar | `4px` height, `--color-primary-600` fill, `--color-gray-200` track |
| Error State | Red border, error message below |

---

## 10. StatusBadge

Inline pill-style badge showing entity status. Color-coded per `UI_DESIGN_SYSTEM.md` Section 1D mappings.

### Props Interface

```typescript
interface StatusBadgeProps {
  status: string;                       // e.g., 'PENDING', 'IN_PROGRESS', 'HIGH'
  module: 'nivedan' | 'inward' | 'devworks' | 'priority' | 'role';
  size?: 'sm' | 'md';                   // Default: 'md'
  showIcon?: boolean;                   // Show emoji prefix. Default: false
}
```

### Status → Color Map

**Nivedan Module:**

| Status | Text Color | Background | Border | Emoji |
|--------|-----------|------------|--------|-------|
| `PENDING` | `--color-warning` | `--color-warning-bg` | `--color-warning-border` | 🟡 |
| `IN_PROGRESS` | `--color-info` | `--color-info-bg` | `--color-info-border` | 🔵 |
| `FORWARDED` | `--color-orange` | `--color-orange-bg` | `--color-orange-border` | 🟠 |
| `AWAITING_RESPONSE` | `--color-purple` | `--color-purple-bg` | `--color-purple-border` | 🟣 |
| `RESOLVED` | `--color-success` | `--color-success-bg` | `--color-success-border` | 🟢 |
| `REJECTED` | `--color-error` | `--color-error-bg` | `--color-error-border` | 🔴 |
| `CANCELLED` | `--color-neutral` | `--color-neutral-bg` | `--color-neutral-border` | ⚪ |

**Priority Module:**

| Status | Text Color | Background |
|--------|-----------|------------|
| `HIGH` | `--color-error` | `--color-error-bg` |
| `MEDIUM` | `--color-warning` | `--color-warning-bg` |
| `LOW` | `--color-success` | `--color-success-bg` |

**Role Module (for User Mgmt / Karyakarta):**

| Role | Text Color | Background |
|------|-----------|------------|
| `MLA` | `--color-warning` | `--color-warning-bg` |
| `PA` | `--color-info` | `--color-info-bg` |
| `RECEPTIONIST` | `--color-success` | `--color-success-bg` |
| `STAFF` | `--color-purple` | `--color-purple-bg` |
| `AUDITOR` | `--color-orange` | `--color-orange-bg` |
| `ADMIN` | `--color-error` | `--color-error-bg` |
| `BOOTH_PRAMUKH` | `--color-purple` | `--color-purple-bg` |
| `WARD_HEAD` | `--color-info` | `--color-info-bg` |
| `KARYAKARTA` | `--color-success` | `--color-success-bg` |
| `VOLUNTEER` | `--color-warning` | `--color-warning-bg` |

### Visual Specs

| Property | Value |
|----------|-------|
| Height | `22px` (md), `18px` (sm) |
| Padding | `2px 8px` (md), `1px 6px` (sm) |
| Font Size | `--text-xs` (12px) md, `--text-2xs` (10px) sm |
| Font Weight | `--font-medium` (500) |
| Border | `1px solid {status-border}` |
| Border Radius | `--radius-sm` (2px) |
| Text Transform | `uppercase` |
| Letter Spacing | `0.3px` |

### Usage Example

```jsx
<StatusBadge status="PENDING" module="nivedan" />
<StatusBadge status="HIGH" module="priority" showIcon />
<StatusBadge status="PA" module="role" size="sm" />
```

---

## 11. KPICard

Dashboard stat card showing a metric value with trend indicator.

### Props Interface

```typescript
interface KPICardProps {
  icon: LucideIcon;
  label: string;
  labelMr?: string;
  value: number | string;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    value: string;                      // e.g., "12%", "+34"
    label?: string;                     // e.g., "from last month"
  };
  color?: string;                       // Value color (CSS variable)
  onClick?: () => void;                 // Click to navigate to related list
  isLoading?: boolean;
}
```

### Visual Structure

```
┌──────────────────────────────┐
│  📊  Total Nivedans           │  ← Icon (24px) + Label (--text-sm, gray-500)
│                               │
│  1,247                        │  ← Value (--text-3xl, bold, gray-900)
│                               │
│  ↑ 12% from last month       │  ← Trend (--text-xs, success/error)
└──────────────────────────────┘
```

### Visual Specs

| Property | Value |
|----------|-------|
| Background | `--bg-card` |
| Border | `1px solid --color-gray-200` |
| Border Radius | `--radius-md` (4px) |
| Shadow | `--shadow-sm` |
| Padding | `--space-4` (16px) |
| Min Width | `200px` |
| Icon Size | `24px`, `--color-primary-400` |
| Label Font | `--text-sm` (13px), `--color-gray-500` |
| Value Font | `--text-3xl` (30px), `--font-bold`, `--color-gray-900` |
| Value (custom color) | Uses `color` prop CSS variable |
| Trend Up | `↑` prefix, `--color-success` |
| Trend Down | `↓` prefix, `--color-error` |
| Trend Neutral | `→` prefix, `--color-gray-500` |
| Trend Font | `--text-xs` (12px), `--font-medium` |
| Clickable Hover | `--shadow-md`, `border-color: --color-primary-200`, `cursor: pointer` |
| Grid Layout | `repeat(auto-fill, minmax(200px, 1fr))` with `--space-4` gap |
| Loading | Skeleton shimmer for icon, label, value areas |
| Number Format | Indian: `Intl.NumberFormat('en-IN')` — e.g., `1,247` not `1247` |

---

## 12. AvatarInitials

Circular or rounded-square avatar displaying user initials with role-colored background.

### Props Interface

```typescript
interface AvatarInitialsProps {
  name: string;                         // Full name — initials extracted automatically
  size?: 'xs' | 'sm' | 'md' | 'lg';    // Default: 'md'
  role?: string;                        // Maps to role color (see StatusBadge role colors)
  imageUrl?: string;                    // If provided, shows image instead of initials
  shape?: 'square' | 'circle';         // Default: 'square' (3px radius)
}
```

### Size Variants

| Size | Dimensions | Font Size | Border Radius |
|------|-----------|-----------|---------------|
| `xs` | `24px × 24px` | `10px` | `--radius-base` or `--radius-full` |
| `sm` | `32px × 32px` | `12px` | `--radius-base` or `--radius-full` |
| `md` | `36px × 36px` | `13px` | `--radius-base` or `--radius-full` |
| `lg` | `48px × 48px` | `16px` | `--radius-base` or `--radius-full` |

### Initials Extraction Logic

```typescript
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return parts[0].substring(0, 2).toUpperCase();
}
// "Ramesh Patil" → "RP"
// "Sunil" → "SU"
// "Priya V. Deshmukh" → "PD"
```

### Visual Specs

| Property | Value |
|----------|-------|
| Background | Role-colored `--color-{role}-bg` or `--color-primary-50` (default) |
| Text Color | Role-colored `--color-{role}` or `--color-primary-600` (default) |
| Font Weight | `--font-bold` (700) |
| Display | `flex; align-items: center; justify-content: center` |
| Image Mode | `object-fit: cover; border-radius: inherit` |

---

## 13. ProgressBar

Horizontal progress indicator with percentage label. Used in Dev Works detail.

### Props Interface

```typescript
interface ProgressBarProps {
  value: number;                        // 0-100
  size?: 'sm' | 'md' | 'lg';           // Default: 'md'
  color?: 'primary' | 'success' | 'warning' | 'error' | 'auto'; // Default: 'auto'
  showLabel?: boolean;                  // Show percentage text. Default: true
  label?: string;                       // Custom label (overrides percentage)
  animated?: boolean;                   // Animated fill on mount. Default: true
}
```

### Auto-Color Logic

When `color="auto"` (default):

| Progress | Color |
|----------|-------|
| 0–30% | `--color-error` (red) |
| 31–70% | `--color-warning` (amber) |
| 71–100% | `--color-success` (green) |

### Size Variants

| Size | Track Height | Label Size |
|------|-------------|------------|
| `sm` | `6px` | `--text-2xs` (10px) |
| `md` | `10px` | `--text-xs` (12px) |
| `lg` | `16px` | `--text-sm` (13px) — label inside bar |

### Visual Specs

| Property | Value |
|----------|-------|
| Track BG | `--color-gray-100` |
| Track Radius | `--radius-base` (3px) |
| Fill Radius | `--radius-base` (3px) |
| Label Position | Inside fill (lg) or right of bar (sm/md) |
| Label Font Weight | `--font-bold` |
| Label Color | `#FFFFFF` inside bar, `--color-gray-600` outside |
| Animation | `width` transition over `600ms ease-out` on mount |

### Usage Example

```jsx
<ProgressBar value={72} size="lg" />           // Auto-color: green at 72%
<ProgressBar value={25} color="error" />        // Forced red
<ProgressBar value={100} label="Complete ✓" />  // Custom label
```

---

## 14. Timeline

Vertical timeline for activity history. Used in Nivedan detail and audit trail.

### Props Interface

```typescript
interface TimelineProps {
  items: TimelineItem[];
  maxItems?: number;                    // Show "View all X events" after this
}

interface TimelineItem {
  id: string;
  timestamp: string;                    // ISO date string
  title: string;                        // Main event text
  description?: string;                 // Details
  user?: string;                        // Who performed the action
  type: 'created' | 'status_change' | 'assigned' | 'comment' | 
        'whatsapp' | 'forwarded' | 'resolved' | 'photo' | 'system';
  metadata?: Record<string, string>;    // Extra data (old status → new status)
}
```

### Type → Visual Mapping

| Type | Icon | Color | Dot Color |
|------|------|-------|-----------|
| `created` | `Plus` | `--color-success` | Green |
| `status_change` | `RefreshCw` | `--color-info` | Blue |
| `assigned` | `UserPlus` | `--color-purple` | Purple |
| `comment` | `MessageSquare` | `--color-gray-500` | Gray |
| `whatsapp` | `MessageCircle` | `--color-success` | Green |
| `forwarded` | `ExternalLink` | `--color-orange` | Orange |
| `resolved` | `CheckCircle` | `--color-success` | Green |
| `photo` | `Camera` | `--color-info` | Blue |
| `system` | `Settings` | `--color-gray-400` | Gray |

### Visual Specs

| Property | Value |
|----------|-------|
| Line | `2px solid --color-gray-200`, vertical, left-aligned |
| Dot Size | `28px × 28px`, `--radius-base` |
| Dot Position | Centered on the line |
| Dot BG | Type-specific `--color-{type}-bg` |
| Dot Icon | Type-specific Lucide icon, `14px` |
| Content Offset | `12px` left of dot |
| Title | `--text-sm` (13px), `--font-semibold`, `--color-gray-900` |
| Description | `--text-xs` (12px), `--color-gray-500` |
| Timestamp | `--text-2xs` (10px), `--color-gray-400` |
| User Name | `--text-xs`, `--font-medium`, `--color-gray-600` |
| Item Spacing | `--space-4` (16px) between items |
| "View all" | `--text-xs`, `--color-primary-600`, appears when items exceed `maxItems` |

---

## 15. TreeView

Collapsible hierarchical tree. Used in Booth Structure page.

### Props Interface

```typescript
interface TreeViewProps {
  nodes: TreeNode[];
  selectedId?: string;
  onSelect: (node: TreeNode) => void;
  searchQuery?: string;                 // Filters and highlights matching nodes
}

interface TreeNode {
  id: string;
  label: string;
  labelMr?: string;
  icon?: string;                        // Emoji or Lucide icon
  count?: number;                       // Badge count (voter count, booth count)
  children?: TreeNode[];
  isExpanded?: boolean;
}
```

### Visual Specs

| Property | Value |
|----------|-------|
| Container BG | `--bg-card` |
| Container Border | `1px solid --color-gray-200` |
| Container Radius | `--radius-base` (3px) |
| Node Row Padding | `7px 8px` |
| Node Row Radius | `--radius-base` (3px) |
| Node Font | `--text-sm` (13px), `--color-gray-600` |
| Node Hover BG | `--color-primary-50` |
| Active Node BG | `--color-primary-50` |
| Active Node Color | `--color-primary-600`, `--font-semibold` |
| Toggle Icon | `▶` (collapsed), `▼` (expanded), `--text-2xs`, `--color-gray-400` |
| Node Icon | `14px`, positioned before label |
| Count Badge | `--text-xs`, `--color-gray-400`, `--color-gray-50` bg, `border-radius: 10px`, `1px 6px` padding |
| Indent Per Level | `22px` left padding |
| Search Highlight | Matching text gets `--color-warning-bg` background |
| Max Height | `calc(100vh - 200px)` with `overflow-y: auto` |
| Transition | Collapse/expand uses `--transition-base` (200ms) |

---

## 16. Modal

Overlay dialog for confirmations, quick forms, and detail views.

### Props Interface

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  titleMr?: string;
  size?: 'sm' | 'md' | 'lg' | 'full';  // Default: 'md'
  children: React.ReactNode;            // Modal body content
  footer?: React.ReactNode;             // Action buttons (Cancel + Confirm)
  closeOnOverlay?: boolean;             // Default: true
  closeOnEsc?: boolean;                 // Default: true
  showCloseButton?: boolean;            // Default: true
}
```

### Size Variants

| Size | Width | Use Case |
|------|-------|----------|
| `sm` | `400px` | Confirmation dialogs, simple prompts |
| `md` | `560px` | Quick forms, assignment modals |
| `lg` | `720px` | Detail views, complex forms |
| `full` | `90vw` | Full-screen overlays, preview panes |

### Visual Specs

| Property | Value |
|----------|-------|
| Overlay BG | `rgba(15,23,42,0.5)` (light), `rgba(0,0,0,0.7)` (dark) |
| Max Height | `85vh` with internal scroll |
| Background | `--bg-card` |
| Border Radius | `--radius-md` (4px) |
| Shadow | `--shadow-lg` |
| Header | `padding: 16px 20px`, `--text-lg`, `--font-semibold`, bottom border |
| Body | `padding: 20px`, scrollable if overflow |
| Footer | `padding: 12px 20px`, top border, right-aligned buttons with `8px` gap |
| Close Button | `X` icon, `32px × 32px`, ghost style, `absolute top-right` |
| Open Animation | `fadeIn` + `scaleIn` (0.95→1.0), `200ms ease-out` |
| Close Animation | Reverse of open, `150ms ease-in` |
| Focus Trap | Focus stays within modal when open |
| Z-Index | `--z-modal` (500) |

### Usage Example

```jsx
<Modal
  isOpen={showAssign}
  onClose={() => setShowAssign(false)}
  title="Assign to Staff"
  titleMr="कर्मचाऱ्यास नेमा"
  size="sm"
  footer={
    <>
      <Button variant="ghost" onClick={() => setShowAssign(false)}>Cancel</Button>
      <Button variant="primary" onClick={handleAssign}>Assign</Button>
    </>
  }
>
  <FormField name="staffId" label="Staff Member" type="select" options={staffList} />
  <FormField name="notes" label="Notes" type="textarea" rows={3} />
</Modal>
```

---

## 17. Toast

Non-blocking notification popup. Uses `react-toastify` themed to match design system.

### Props Interface (wrapper function)

```typescript
function showToast(options: ToastOptions): void;

interface ToastOptions {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;                    // ms. Default varies by type
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

### Type Defaults

| Type | Left Border Color | Icon | Auto-Dismiss |
|------|------------------|------|-------------|
| `success` | `--color-success` | `CheckCircle` | 5000ms |
| `error` | `--color-error` | `XCircle` | 8000ms |
| `warning` | `--color-warning` | `AlertTriangle` | 6000ms |
| `info` | `--color-info` | `Info` | 5000ms |

### Visual Specs

| Property | Value |
|----------|-------|
| Position | Top-right |
| Width | `360px` |
| Background | `--bg-card` |
| Border | `1px solid --color-gray-200` |
| Left Border | `4px solid {type-color}` |
| Border Radius | `--radius-base` (3px) |
| Shadow | `--shadow-md` |
| Title | `--text-sm` (13px), `--font-semibold`, `--color-gray-900` |
| Message | `--text-xs` (12px), `--color-gray-600` |
| Close Button | `X` icon, `16px`, top-right |
| Stack | Up to 3 visible, older ones slide up |
| Animation | Slide in from right, `--transition-spring` |
| Action Button | `--text-xs`, `--font-medium`, `--color-primary-600`, underline on hover |

### Usage Example

```jsx
showToast({ type: 'success', title: 'Nivedan Created', message: 'Tracking ID: NIV-2026-00501' });
showToast({ type: 'error', title: 'Upload Failed', message: 'File size exceeds 10MB limit' });
showToast({
  type: 'info', title: 'WhatsApp Sent',
  action: { label: 'View Log', onClick: () => navigate('/whatsapp/delivery-log') }
});
```

---

## 18. EmptyState

Shown when a table or list has zero records. Encourages action.

### Props Interface

```typescript
interface EmptyStateProps {
  icon?: LucideIcon;                    // Default: FolderOpen
  title: string;
  titleMr?: string;
  description?: string;
  action?: {
    label: string;
    icon?: LucideIcon;
    onClick: () => void;
  };
}
```

### Visual Specs

| Property | Value |
|----------|-------|
| Container | Centered vertically and horizontally, `padding: --space-12` |
| Icon Size | `64px`, `--color-gray-300` |
| Title | `--text-lg` (18px), `--font-semibold`, `--color-gray-700` |
| Description | `--text-base` (14px), `--color-gray-500`, max-width `400px`, centered |
| Action Button | Primary variant, rendered `--space-4` below description |
| Gap | Icon→Title: `--space-4`, Title→Desc: `--space-2`, Desc→Button: `--space-4` |

### Common Empty States

| Page | Title | Description | Action |
|------|-------|-------------|--------|
| Nivedans | No Nivedans Found | No complaints have been registered yet. | + New Nivedan |
| Inward | No Inward Entries | No letters have been recorded yet. | + New Inward |
| Visitors | No Visitors Today | No visitors have checked in today. | + Check In Visitor |
| Dev Works | No Projects | No development works have been added. | + New Project |
| Karyakarta | No Workers Found | No karyakartas match your filters. | Clear Filters |
| Search | No Results | No records match your search query. | — |

---

## 19. SkeletonLoader

Animated loading placeholder rendered while data is being fetched.

### Props Interface

```typescript
interface SkeletonLoaderProps {
  variant: 'table' | 'cards' | 'kpi' | 'detail' | 'form' | 'text' | 'custom';
  rows?: number;                        // For table variant. Default: 8
  columns?: number;                     // For table variant. Default: 6
  count?: number;                       // For cards/kpi variant. Default: 4
}
```

### Visual Specs

| Property | Value |
|----------|-------|
| Base Color | `--color-gray-100` |
| Shimmer Color | `--color-gray-200` (sweeps left to right) |
| Animation | `shimmer` keyframe, `1.5s ease infinite` |
| Border Radius | Matches the component being loaded (`--radius-base` for inputs, `--radius-md` for cards) |
| Gradient | `linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)` |

### Variant Specs

| Variant | Structure |
|---------|-----------|
| `table` | Header row (full width bar) + N data rows (alternating width bars per column) |
| `cards` | Grid of N rounded rectangles (matches KPICard dimensions) |
| `kpi` | Row of 4-6 small rectangles with icon placeholder + value bar + label bar |
| `detail` | Header bar (wide) + meta row (3 bars) + content area (varied width bars) |
| `form` | Label bar (short) + input bar (wide), repeated for N fields |
| `text` | 3-4 lines of varying-width bars simulating paragraph text |

---

## 20. DropdownMenu

Popover menu with action items. Used for avatar menu, row actions, and bulk actions.

### Props Interface

```typescript
interface DropdownMenuProps {
  trigger: React.ReactNode;             // Button/element that opens the dropdown
  items: DropdownItem[];
  align?: 'left' | 'right';            // Default: 'right'
  width?: string;                       // Default: '200px'
}

interface DropdownItem {
  icon?: LucideIcon;
  label: string;
  labelMr?: string;
  onClick: () => void;
  variant?: 'default' | 'danger';       // Danger: red text/icon
  disabled?: boolean;
  divider?: boolean;                    // Renders a divider line before this item
}
```

### Visual Specs

| Property | Value |
|----------|-------|
| Background | `--bg-card` |
| Border | `1px solid --color-gray-200` |
| Border Radius | `--radius-base` (3px) |
| Shadow | `--shadow-md` |
| Min Width | `180px` |
| Item Padding | `8px 12px` |
| Item Font | `--text-sm` (13px), `--color-gray-700` |
| Item Hover BG | `--color-gray-50` |
| Item Icon | `16px`, `--color-gray-500`, `8px` right margin |
| Danger Item | `--color-error` text and icon |
| Divider | `1px solid --color-gray-100`, `4px` vertical margin |
| Disabled Item | `opacity: 0.4`, `cursor: not-allowed` |
| Open Animation | `slideInDown` from trigger, `150ms ease-out` |
| Close | Clicks outside, `Esc` key, or item click |
| Z-Index | `--z-dropdown` (400) |

### Usage Example

```jsx
// Avatar dropdown in topbar
<DropdownMenu
  trigger={<AvatarInitials name="Rajesh Patil" size="sm" />}
  items={[
    { icon: User, label: 'My Profile', onClick: () => navigate('/settings?tab=profile') },
    { icon: Settings, label: 'Settings', onClick: () => navigate('/settings') },
    { icon: LogOut, label: 'Logout', onClick: handleLogout, divider: true, variant: 'danger' }
  ]}
/>

// Row action menu in DataTable
<DropdownMenu
  trigger={<Button variant="ghost" icon={MoreVertical} size="sm" />}
  items={[
    { icon: Eye, label: 'View Detail', onClick: () => navigate(`/nivedans/${id}`) },
    { icon: Pencil, label: 'Edit', onClick: () => navigate(`/nivedans/${id}/edit`) },
    { icon: Printer, label: 'Print Receipt', onClick: () => printReceipt(id) },
    { icon: XCircle, label: 'Cancel', onClick: () => cancelNivedan(id), divider: true, variant: 'danger' }
  ]}
/>
```

---

## 21. DateNavigator

Day-by-day navigation control for date-scoped pages. Used in Visitor Book.

### Props Interface

```typescript
interface DateNavigatorProps {
  date: Date;                           // Currently displayed date
  onChange: (date: Date) => void;
  minDate?: Date;                       // Earliest selectable date
  maxDate?: Date;                       // Latest (typically today). Default: today
  showDatePicker?: boolean;             // Show calendar icon for direct jump. Default: true
  format?: string;                      // Display format. Default: "dddd, DD MMMM YYYY"
}
```

### Visual Structure

```
┌────────────────────────────────────────────────────────────┐
│   ‹   │   Saturday, 02 August 2026   │   ›   │  📅  Today │
└────────────────────────────────────────────────────────────┘
```

### Visual Specs

| Property | Value |
|----------|-------|
| Container | `display: flex; align-items: center; gap: --space-3` |
| Prev/Next Buttons | `36px × 36px`, `1px solid --color-gray-200`, `--radius-base`, `--text-md` |
| Prev/Next Hover | `border-color: --color-primary-500; color: --color-primary-600` |
| Date Text | `--text-md` (16px), `--font-semibold`, `--color-gray-900` |
| Date Format | Full day name + DD MMMM YYYY — e.g., "Saturday, 02 August 2026" |
| Date (Marathi) | `शनिवार, ०२ ऑगस्ट २०२६` — uses Marathi day/month names |
| Calendar Icon | `Calendar` Lucide, `20px`, opens date-picker modal |
| "Today" Button | `height: 32px`, ghost button, `--text-xs`, `--font-medium` |
| Disabled State | Future dates: `›` button disabled. Before min date: `‹` disabled |
| URL Sync | Updates URL query param: `?date=2026-08-02` |

### Usage Example

```jsx
<DateNavigator
  date={selectedDate}
  onChange={setSelectedDate}
  maxDate={new Date()}
  format="dddd, DD MMMM YYYY"
/>
```

---

## Appendix A: Component File Structure

All components follow this file structure in the React project:

```
src/
├── components/
│   ├── layout/
│   │   ├── PageHeader/
│   │   │   ├── PageHeader.jsx
│   │   │   └── PageHeader.module.css
│   │   ├── Sidebar/
│   │   └── Topbar/
│   │
│   ├── navigation/
│   │   ├── Breadcrumb/
│   │   ├── Tabs/
│   │   ├── Pagination/
│   │   └── DropdownMenu/
│   │
│   ├── data-display/
│   │   ├── DataTable/
│   │   ├── StatusBadge/
│   │   ├── KPICard/
│   │   ├── AvatarInitials/
│   │   ├── ProgressBar/
│   │   ├── Timeline/
│   │   └── TreeView/
│   │
│   ├── data-controls/
│   │   ├── FilterBar/
│   │   ├── SearchBar/
│   │   └── DateNavigator/
│   │
│   ├── form/
│   │   ├── FormField/
│   │   └── FileUploadZone/
│   │
│   ├── overlay/
│   │   └── Modal/
│   │
│   └── feedback/
│       ├── Toast/
│       ├── EmptyState/
│       └── SkeletonLoader/
│
├── styles/
│   ├── tokens.css           ← All CSS Custom Properties from UI_DESIGN_SYSTEM.md
│   ├── reset.css
│   └── global.css
│
└── utils/
    ├── formatters.js         ← Indian number format, date format, currency
    └── helpers.js            ← getInitials(), statusColorMap, etc.
```

---

## Appendix B: Shared Utilities

### Number Formatting

```javascript
// Indian numbering: 1,00,000 (not 100,000)
export const formatIndianNumber = (num) => 
  new Intl.NumberFormat('en-IN').format(num);

// Currency: ₹ 2,45,000
export const formatCurrency = (num) => 
  `₹ ${new Intl.NumberFormat('en-IN').format(num)}`;

// Compact: 2.45 Cr, 12.5 L
export const formatCompactCurrency = (num) => {
  if (num >= 10000000) return `₹ ${(num / 10000000).toFixed(2)} Cr`;
  if (num >= 100000) return `₹ ${(num / 100000).toFixed(1)} L`;
  return formatCurrency(num);
};
```

### Date Formatting

```javascript
import dayjs from 'dayjs';

// Display: 02/08/2026
export const formatDate = (date) => dayjs(date).format('DD/MM/YYYY');

// Display with time: 02/08/2026, 4:30 PM
export const formatDateTime = (date) => dayjs(date).format('DD/MM/YYYY, h:mm A');

// Relative: "2 hours ago", "Yesterday"
export const formatRelative = (date) => dayjs(date).fromNow();
```

### Tracking ID Formatting

```javascript
// Monospace font class for IDs
// INW-2026-0389, NIV-2026-01247, OUT-2026-0157
export const TrackingId = ({ value }) => (
  <span style={{ fontFamily: 'var(--font-family-mono)', fontSize: '13px' }}>
    {value}
  </span>
);
```
