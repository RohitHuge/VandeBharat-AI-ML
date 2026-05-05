# AI Railway Inspection System - Frontend Implementation Plan

## 1. Introduction
This document outlines the step-by-step, phase-wise plan to convert the provided static HTML/Tailwind UI into a fully functional, component-based React application. The design follows the "Industrial Intelligence System" design language with a "White-out" foundation, Corporate Minimalism, and Glassmorphism.

## Phase 1: React Folder Structure Architecture ✅
We will adopt a scalable, feature-based folder structure inside the `src/` directory.

```text
frontend/src/
├── assets/           # Images, icons, global CSS (index.css)
├── components/       # Reusable UI components
│   ├── ui/           # Buttons, Inputs, Cards, Badges
│   ├── layout/       # TopNavBar, SideNavBar, MainLayout
│   └── shared/       # Shared complex components (e.g., VideoPlayer, DataTable)
├── pages/            # Page-level components corresponding to each UI screen
│   ├── Dashboard/          # ai_railway_inspection_system_dashboard
│   ├── DefectLogs/         # defect_logs_ai_railway_inspection_system
│   ├── Maintenance/        # maintenance_management_ai_railway_inspection_system
│   ├── Overview/           # overview_dashboard_ai_railway_inspection_system
│   └── TrackAnalysis/      # track_analysis_ai_railway_inspection_system
├── routes/           # React Router configuration
├── hooks/            # Custom React hooks (e.g., useTheme, useData)
├── utils/            # Helper functions, constants
├── App.jsx           # Root application component
└── main.jsx          # Entry point
```

## Phase 2: Global Configuration & Design System ✅
**Objective:** Setup Tailwind CSS, Fonts, and Global Styles to match the UI specifications.
- **Tailwind Config:** Update `tailwind.config.js` with the custom colors, spacing, typography, and border radius defined in `UI/industrial_intelligence_system/DESIGN.md`.
- **Global Styles:** Update `src/index.css` to import Google Fonts: `Inter` and `Material Symbols Outlined`.
- **Dark Mode:** Ensure dark mode configuration is set up properly with `darkMode: "class"`.

## Phase 3: Reusable UI Component Library ✅
**Objective:** Build the core design system components that will be shared across all pages.
- **`components/ui/Card.jsx`**: Wrapper for dashboard widgets with `bg-surface-container-lowest`, borders, and optional hover effects.
- **`components/ui/Button.jsx`**: Primary and secondary button variants (with gradients, shadows).
- **`components/ui/Badge.jsx`**: Status chips (e.g., "60 FPS", "Healthy") with various color variants.
- **`components/ui/InputField.jsx`**: Input styles for search and forms.
- **`components/ui/DataTable.jsx`**: Reusable table structure for logs and event history.

## Phase 4: App Shell & Layout Implementation ✅
**Objective:** Build the global application layout that wraps around page content.
- **`components/layout/TopNavBar.jsx`**: Implement the top glassmorphism header with the search bar, notifications, settings, and profile icon.
- **`components/layout/SideNavBar.jsx`**: Implement the fixed sidebar with navigation links and active states.
- **`components/layout/MainLayout.jsx`**: A wrapper component that includes `TopNavBar` and `SideNavBar`, using `<Outlet />` (from React Router) to render the inner page content within the main canvas area.
- **Routing Setup:** Configure React Router in `App.jsx` to render `MainLayout` and route to the respective pages.

## Phase 5: Page-by-Page Implementation
**Objective:** Integrate layouts and components to build out each specific dashboard view.

### 5.1 Live Dashboard Page (`/dashboard`) ✅
- **Path:** `pages/Dashboard/index.jsx`
- **Source:** `UI/ai_railway_inspection_system_dashboard/code.html`
- **Details:** Integrate the Live Video Feed, Event History Table, Processing Timeline (Detection Frequency), Defect Alerts, and System Health widgets.

### 5.2 Overview Dashboard (`/overview`) ✅
- **Path:** `pages/Overview/index.jsx`
- **Source:** `UI/overview_dashboard_ai_railway_inspection_system/code.html`
- **Details:** High-level metrics, summary charts, and network-wide status.

### 5.3 Track Analysis (`/track-analysis`) ✅
- **Path:** `pages/TrackAnalysis/index.jsx`
- **Source:** `UI/track_analysis_ai_railway_inspection_system/code.html`
- **Details:** Deep dive into track telemetry, timeline of track conditions, and GPS coordinates.

### 5.4 Defect Logs (`/defect-logs`) ✅
- **Path:** `pages/DefectLogs/index.jsx`
- **Source:** `UI/defect_logs_ai_railway_inspection_system/code.html`
- **Details:** Comprehensive table of all detected anomalies with filtering, sorting, and pagination.

### 5.5 Maintenance Management (`/maintenance`) ✅
- **Path:** `pages/Maintenance/index.jsx`
- **Source:** `UI/maintenance_management_ai_railway_inspection_system/code.html`
- **Details:** Work order generation, maintenance team assignments, and resolution tracking.
