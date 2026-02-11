# 🚀 LinkedIn Scraper & Local Job Board Assignment

**Automated Job Finding Tool for Freshers**

This project is a complete automated system that scrapes LinkedIn for "Fresher" job roles, filters out low-quality posts (like Gmail addresses), and publishes them to a beautiful, filterable Job Board website hosted live.

---

## 🌟 How It Works (The Workflow)

The system works in a loop to ensure you always have the latest jobs:

1.  **The Scraper (`index.js`)**:
    *   Opens a Chrome browser automatically.
    *   Logs into LinkedIn (using your saved session).
    *   Searches for specific roles (Operations, Finance, Developer, etc.) in multiple cities (Pune, Delhi, Bangalore, etc.).
    *   **Smart Filtering**: It reads every post and checks:
        *   Is it for **Freshers**? (Keywords: "0-1 year", "Batch 2024", etc.)
        *   Is it spam? (Excludes posts with `@gmail.com` emails).
    *   Saves valid jobs to `jobs.json`.

2.  **The Website (Frontend)**:
    *   The website (`index.html`) reads the `jobs.json` file.
    *   It displays the jobs in a clean, dark-mode interface.
    *   Users can filter by **Role** and **Location**.

3.  **Automation (`automate.bat`)**:
    *   A simple script that runs the scraper and automatically pushes the new data to GitHub.
    *   This triggers GitHub Pages to update the live website.

---

## 🛠️ Installation & Setup

### Prerequisites
*   [Node.js](https://nodejs.org/) installed.
*   [Git](https://git-scm.com/) installed.
*   Google Chrome installed.

### Step 1: Clone & Install
```bash
git clone https://github.com/arkapd/ScrapperLinkedin.git
cd ScrapperLinkedin
npm install
```

### Step 2: Run the Scraper (First Time)
To populate the data, run:
```bash
node index.js
```
*   **Note**: The first time you run this, you will need to **Log In** to LinkedIn in the browser window that opens. Future runs will use your saved cookies.

### Step 3: Run the Website Locally
To see the job board on your own computer:
```bash
node server.js
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🤖 How to Automate (One-Click Update)

You don't need to run commands manually every day. We have an automation script.

1.  **Locate `automate.bat`**: It's in the main folder.
2.  **Double-Click it**: 
    *   It will open a terminal.
    *   Run the scraper to find new jobs.
    *   **Automatically push** the new jobs to GitHub.
    *   Your [Live Website](https://arkapd.github.io/ScrapperLinkedin/) will update in ~2 minutes.

**Pro Tip**: You can use **Windows Task Scheduler** to run this file automatically every 12 hours. (See `INSTRUCTIONS.md` for a picture guide).

---

## 📂 Project Structure

*   `index.js`: **The Brain**. This is the scraper code that controls the browser.
*   `website/`: Contains the frontend code.
    *   `index.html`: The structure of the Job Board page.
    *   `style.css`: The styling (Colors, Glassmorphism, Responsive design).
    *   `script.js`: The logic (Fetching data, Filtering jobs).
*   `jobs.json`: **The Database**. Stores all the scraped job listings.
*   `automate.bat`: **The Robot**. Script for auto-updating the project.
*   `server.js`: A simple local server for testing the website.

---

## 🛡️ Security & Features

*   **Anti-Ban**: The scraper waits randomly (like a human) to avoid getting blocked by LinkedIn.
*   **Gmail Filter**: Automatically removes posts requesting resumes to `@gmail.com` (often spam).
*   **Secure**: Uses Content Security Policy (CSP) to prevent hacking on the website.
*   **Privacy**: Does not leak referrer data to LinkedIn when you click "Apply".

---

### Live Demo
👉 **[View the Live Job Board](https://arkapd.github.io/ScrapperLinkedin/)**
