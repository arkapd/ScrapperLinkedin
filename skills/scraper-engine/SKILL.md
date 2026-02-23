---
name: scraper-engine
description: "Multi-source job scraping pipeline using Puppeteer. Handles LinkedIn public page scraping, data extraction (emails, phones via regex), fresher filtering, deduplication against archive.json, and spam rejection. Use when user says 'scrape jobs', 'run the scraper', 'add a job source', 'fix scraping error', 'extend the search grid', 'add a new city', 'modify fresher detection', or 'debug Puppeteer'. Do NOT use for frontend/UI tasks or deployment."
---

# 🚜 Scraper Engine Skill

This skill governs the Puppeteer-based data extraction pipeline. It ensures the bot mimics human behavior while efficiently gathering job data across multiple cities and domains.

## 1. Architecture Overview
**Input**: Search Grid (Cities × Domains) -> **Process**: Browser Automation -> **Filter**: Data Quality Engine -> **Output**: `jobs.json` (Fresh) & `archive.json` (History).

## 2. Puppeteer Configuration
- **Browser State**: `headless: false` with persistent `userDataDir` for cookie management.
- **Human Simulation**:
    - Variable delays: `Math.random() * (10000 - 5000) + 5000` (5-10s) between searches.
    - Random scrolling: `window.scrollBy(0, Math.random() * 500 + 200)`.
    - Human-like pauses between individual post extractions.

## 3. The Search Grid
Managed in `references/search-grid.md`.
- **Current Pattern**: `"{Domain} fresher hiring {Location}"`.
- **Deduplication**: Every new URL is checked against `archive.json` before being added to `localJobs`.

## 4. Error Handling
- **Navigation Timeout**: Caught at the loop level; the bot skips the current query and moves to the next to prevent total failure.
- **Selector Obsolescence**: Uses stable attributes like `data-view-name`. If extraction fails, the post is skipped and logged.
- **CAPTCHA**: The bot pauses and alerts the user to solve it manually in the open browser window.

## 5. Deployment Flow
1. Clear `jobs.json`.
2. Run Scraper Loop.
3. Save to `archive.json` (Append + Sort Descending).
4. Save to `jobs.json` (Fresh Only).
5. Signal completion.

## Examples
- "Add Mumbai to the search rotation" -> Update `references/search-grid.md` and the LOCATIONS array in `index.js`.
- "The bot is scrolling too fast and missing posts" -> Adjust scroll parameters in `references/puppeteer-patterns.md`.
- "Extract data from a new site like Indeed" -> Implement new navigation and selector patterns in a dedicated source module.

## Troubleshooting
- **Empty results**: Check if LinkedIn login is required. Verify if the search query still returns results in a manual browser tab.
- **Deduplication failing**: Ensure `archive.json` path is correct and URLs are being saved in a consistent format.
