---
name: frontend-portal
description: "Campus placement job board UI system. Covers student-facing job board (card layout, city/department/experience filters, search), admin dashboard (job approval queue, analytics, manual posting), and white-label college branding (subdomain, logo, colors). Mobile-first responsive design. Use when user says 'build a page', 'update the UI', 'add a filter', 'fix mobile layout', 'admin dashboard', 'college branding', 'style the cards', or 'add a frontend feature'. Do NOT use for scraper logic or backend API."
---

# 🎨 Frontend Portal Skill

This skill governs the visual and interactive layer of the Campus Placement Platform. It focuses on delivering a premium, mobile-first experience for students and intuitive controls for admins.

## 1. Design System & Aesthetics
- **Philosophy**: Clean, corporate, but modern. No generic "bootstrap" look.
- **Tokens**: Navy/Blue primary palette with **Glassmorphism** effects (transparency, blurs, borders).
- **Mobile-First**: 80%+ of users are on mobile. Containers must be fluid, and text must be legible at 360px widths.

## 2. Component Library
Detailed in `references/component-library.md`.
- **Job Card**: The primary unit of information. Uses `escapeHtml()` for data injection to prevent XSS.
- **Filters**: In-memory dropdowns (City, Department) and a live search bar.
- **Admin Tools**: Approval queues and manual entry forms (see `references/admin-dashboard.md` - *planned*).

## 3. Security Patterns
- **CSP**: Content Security Policy in `index.html` restricts where scripts and styles can load from.
- **Privacy**: `no-referrer` on all external links to hide traffic sources from LinkedIn.
- **Sanitization**: `escapeHtml()` is mandatory for any text scraped from the web.

## 4. White-Label Branding
- **Approach**: CSS Custom Properties (`--primary-color`, `--logo-url`) allow for per-college branding overrides without changing the codebase.

## 5. Development Workflow
1. Mockup in HTML/CSS.
2. Integrate with `script.js` dynamic fetch (`jobs.json`).
3. Test responsiveness on small screens.
4. Verify security headers.

## Examples
- "Add a 'Salary' tag to the job cards" -> Update `assets/card-template.html` and the `renderJobs` function in `script.js`.
- "The filters aren't clearing when I search" -> Debug the state management in `script.js`.
- "Update the header logo for 'University A'" -> Adjust CSS custom properties in the config.

## Troubleshooting
- **Cards not showing**: Check browser console for JSON fetch errors. Verify `jobs.json` existence.
- **Layout broken on mobile**: Inspect CSS media queries in `style.css`.
- **Links not opening**: Check CSP or `target="_blank"` attributes.
