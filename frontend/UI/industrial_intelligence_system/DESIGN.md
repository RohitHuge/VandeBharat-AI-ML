---
name: Industrial Intelligence System
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#424754'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#727785'
  outline-variant: '#c2c6d6'
  surface-tint: '#005ac2'
  primary: '#0058be'
  on-primary: '#ffffff'
  primary-container: '#2170e4'
  on-primary-container: '#fefcff'
  inverse-primary: '#adc6ff'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#924700'
  on-tertiary: '#ffffff'
  tertiary-container: '#b75b00'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffdcc6'
  tertiary-fixed-dim: '#ffb786'
  on-tertiary-fixed: '#311400'
  on-tertiary-fixed-variant: '#723600'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  title-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: '1.4'
  body-main:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-compact:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  mono-data:
    fontFamily: monospace
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 24px
  margin: 32px
---

## Brand & Style
The design system is engineered for high-stakes railway infrastructure monitoring, where precision and reliability are paramount. The visual language balances the rugged nature of industrial engineering with the sophisticated clarity of modern AI-driven SaaS. 

The aesthetic is characterized by **Corporate Minimalism** infused with subtle **Glassmorphism**. This combination ensures that dense technical data remains legible while conveying a sense of "premium technology." The interface prioritizes a "calm dashboard" approach—minimizing cognitive load through generous whitespace and a restricted color palette, allowing critical operational alerts to command immediate attention. The atmosphere is clinical yet approachable, establishing the platform as a dependable partner for infrastructure safety.

## Colors
This design system utilizes a palette rooted in industrial trust and digital intelligence. The core experience is built on a "White-out" foundation to maximize contrast and focus.

- **Primary Blue (#3B82F6):** Represents AI intelligence and active state. Used for primary actions, progress indicators, and data highlights.
- **Operational Green (#10B981):** Signals system health and successful inspection passes.
- **Alert Red (#EF4444):** Reserved strictly for critical track defects or hardware failures.
- **Neutrals:** A range of Slate and Blue-Grays are used for text hierarchy and subtle bordering. Backgrounds use pure white, while nested containers use #F8FAFC and #F1F5F9 to create structural depth without heavy lines.

## Typography
The system utilizes **Inter** for its exceptional legibility in data-dense environments. The typographic scale is strictly hierarchical to help users scan long lists of telemetry and inspection logs.

Headlines use tighter letter spacing and heavier weights to feel authoritative. Body text is optimized for readability with a 1.6 line height. A monospaced alternative is introduced specifically for GPS coordinates, track mileposts, and timestamp data to ensure vertical alignment in tables. Labels utilize uppercase styling to differentiate metadata from primary content.

## Layout & Spacing
The layout follows a **12-column fluid grid** system designed to maximize the screen real estate of ruggedized field tablets and widescreen control room monitors. 

Spacing is governed by an 8px rhythmic scale. Sidebars are fixed-width (280px) to maintain a stable navigation anchor, while the content area expands. Components should prioritize "Internal Padding" (24px) to ensure that even complex inspection reports feel airy and organized. Use consistent 24px gutters between dashboard widgets to maintain a cohesive visual grid.

## Elevation & Depth
Depth in this design system is achieved through **Glassmorphism** and soft, diffused shadows rather than heavy borders.

1.  **Level 0 (Floor):** Pure White (#FFFFFF) background.
2.  **Level 1 (Cards):** Subtle #F1F5F9 fill with a 1px border of #E2E8F0.
3.  **Level 2 (Active Overlays/Modals):** Backdrop-blur (20px) with 70% opacity white fill. These surfaces feature a "Soft Shadow"—a 12% opacity neutral tint with a 30px blur and 10px Y-offset.
4.  **The "Glass" Effect:** Used for floating navigation bars or header sections. These should have a thin white inner-stroke (1px, 40% opacity) to catch the light, simulating a premium lens or glass surface.

## Shapes
The shape language is **Rounded (Level 2)**, utilizing a 0.5rem (8px) radius for standard components like buttons and input fields. 

This softened geometry provides a modern, "SaaS-like" approachability that contrasts with the hard-edged reality of heavy rail equipment. Larger containers like dashboard cards and modals use 1rem (16px) or 1.5rem (24px) radii to further emphasize the premium, professional nature of the platform. Interactive elements like toggle switches and status badges utilize pill-shapes (full round) to distinguish them from structural layout elements.

## Components
- **Buttons:** Primary buttons use a subtle vertical gradient (Primary Blue to a slightly darker shade) with a 1px inset top border for a tactile, "high-tech" feel.
- **Cards:** Dashboard widgets should use the #F1F5F9 background with no visible shadow unless hovered. On hover, the card lifts slightly using the Level 2 shadow.
- **Data Tables:** Row separators are thin (1px) #F1F5F9 lines. Headers are styled with the `label-caps` typography and a light gray background.
- **Status Chips:** Small, pill-shaped indicators. For example, "Healthy" uses a soft green background at 10% opacity with solid green text.
- **Input Fields:** Minimalist white fills with a #E2E8F0 border. On focus, the border transitions to Primary Blue with a subtle 4px outer glow.
- **Inspection Feed:** A specialized vertical timeline component using a thin 2px central line and icons to indicate specific points of interest (defects, maintenance, or clear zones) along the track.