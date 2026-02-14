# 📜 Project Journey: From Script to Platform

This document tracks the evolution of the LinkedIn Scraper & Job Board project. It serves as a timeline of how a simple data gathering idea evolved into a fully automated, user-friendly web platform.

---

## 🚀 The Timeline

### **Phase 1: The Inception (The Code)**
*   **Goal**: Create a script to find "Operations" jobs in Pune on LinkedIn.
*   **Action**: Built a raw Node.js script using **Puppeteer**.
*   **Result**: A bot that could open a browser, search for specific terms, and print results to the console.

### **Phase 2: Intelligence & Filtering (The Logic)**
*   **Problem**: LinkedIn search results are messy. They include "10+ years experience" roles even when searching for "Fresher".
*   **Solution**: Implemented the **Fresher Logic Algorithm**.
    *   *Negative Filters*: Automatically rejects posts mentioning "Minimum 3 years", "5+ years", etc.
    *   *Positive Filters*: Prioritizes "Batch 2024", "0-1 year", "Entry Level".
    *   *Spam Filter*: Added logic to ignore generic `@gmail.com` posts to reduce low-quality listings.

### **Phase 3: The Frontend (The Visuals)**
*   **Shift**: We realized reading JSON files is boring. We needed a tailored Interface.
*   **Action**: Built a local web server (`server.js`) and a frontend.
*   **Design**: Adopted a premium **Glassmorphism** aesthetic (Dark Mode, Blur effects) to make it look professional.
*   **Features**: Added dropdown filters for Role (Operations, Finance, HR) and Location.

### **Phase 4: Expansion (The Scale)**
*   **Growth**: The logic worked for Pune, so we expanded it.
*   **Action**: Updated the scraper to loop through **4 Major Cities** (Pune, Delhi, Bangalore, Hyderabad) and **5+ Domains** (HR, IT/Developer, Supply Chain, etc.).
*   **Optimization**: Added human-like delays and random scrolling to keep the bot safe from detection.

### **Phase 5: Automation (The Robot)**
*   **Goal**: "Zero Touch" operation.
*   **Action**: Created `automate.bat`.
    *   Now, a single click (or a scheduled task) runs the scraper, updates the database, commits the code, and pushes it to GitHub.
    *   Integrated with **Windows Task Scheduler** to run silently in the background every 12 hours.

### **Phase 6: Deployment & Security (The Cloud)**
*   **Action**: Hosted the frontend on **GitHub Pages** for public access.
*   **Security**:
    *   Added **Content Security Policy (CSP)** to prevent hacking (XSS).
    *   Added **Privacy attributes** (`no-referrer`) to protect user data.
    *   Refactored the file structure to place `jobs.json` in the root for easy hosting.

### **Phase 7: Data Architecture (The Polish) [LATEST]**
*   **Problem**: The website showed *old* jobs mixed with new ones.
*   **Solution**: Re-architected the storage logic (v3.0).
    *   **Fresh Jobs**: `jobs.json` is now WIPED clean on every run. The website *only* shows what was found **today**.
    *   **Archive**: A new `archive.json` was created to permanently store history.
    *   **Auto-Refresh**: The website now automatically polls for new data every 60 seconds without reloading.

---

## 🔮 Summary of Capabilities
| Feature | Status | Description |
| :--- | :--- | :--- |
| **Scraping** | ✅ | Multi-City, Multi-Role, Human Simulation |
| **Logic** | ✅ | Strict Fresher Filtering, Anti-Spam |
| **Hosting** | ✅ | Live on GitHub Pages |
| **Automation** | ✅ | One-click update via `automate.bat` |
| **History** | ✅ | Full archival of all past jobs |

---

**Project maintained by [Arkadipta/ssodl]**
