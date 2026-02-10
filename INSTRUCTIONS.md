# 🚀 LinkedIn Scraper & Job Board Setup Guide

This guide will help you run the scraper, start the job board locally, and host it live on GitHub.

## 🛠️ 1. Prerequisites
- **Node.js**: Download and install from [nodejs.org](https://nodejs.org/).
- **Git**: Download and install from [git-scm.com](https://git-scm.com/).
- **Google Chrome**: Required for the scraper to run.

## 📥 2. Installation
Open your terminal (Command Prompt or VS Code Terminal) in this folder and run:

```bash
npm install
```
This installs all necessary dependencies (puppeteer, express, etc.).

---

## 🕷️ 3. How to Run the Scraper
The scraper logs into LinkedIn, searches for jobs, and saves them to `website/jobs.json`.

1. Run the command:
   ```bash
   node index.js
   ```
2. **Login Step**: The browser will open.
   - If you are not logged in, the script will pause.
   - **Log in manually** in the browser window.
   - Once logged in, the script will detect it automatically (or you can create a `trigger.txt` file in the folder to force it to continue).
3. The scraper will now automatically:
   - Go to search results for multiple locations (Pune, Delhi, etc.).
   - Scroll and extract "Fresher" jobs.
   - Save new jobs to `website/jobs.json`.

**Note**: You can run this once a day to update the jobs.

---

## 💻 4. How to Run the Job Board Locally
To view the jobs on your own computer:

1. Run the command:
   ```bash
   node server.js
   ```
2. Open your browser and go to:
   [http://localhost:3000](http://localhost:3000)

You should see the **SSODL JOB Board** with the latest scraped data.

---

## 🌐 5. How to Host Live on GitHub Pages
You can host this website so anyone can view it. Since we updated the code to be "static-friendly", you can use GitHub Pages.

1. **Push your latest code** to GitHub (already done!).
2. Go to your repository settings:
   - URL: https://github.com/arkapd/ScrapperLinkedin/settings/pages
3. Under **"Build and deployment"**:
   - **Source**: Deploy from a branch
   - **Branch**: Select `main` -> `/ (root)`
   - Click **Save**.
4. Wait about 1-2 minutes. GitHub will give you a link (e.g., `https://arkapd.github.io/ScrapperLinkedin/`).
5. **Important**: Since your website files are in a "website" folder, your actual live URL will be:
   
   👉 **https://arkapd.github.io/ScrapperLinkedin/website/**

   (Add `/website/` to the end of the link GitHub gives you).

### ⚠️ Important Note on Live Hosting
The **Live Website** will only show the jobs that were in `jobs.json` when you last pushed to GitHub.
- The **Scraper** (`node index.js`) runs on your *computer*, not on GitHub.
- To update the live site:
  1. Run `node index.js` locally to get new jobs.
  2. Commit and push the updated `jobs.json` to GitHub:
     ```bash
     git add website/jobs.json
     git commit -m "Update jobs"
     git push
     ```
  3. The live site will update automatically after a minute.

---

## 🤖 6. How to Automate (Every 12 Hours)
I have created a script `automate.bat` that runs the scraper and pushes the data to GitHub automatically.

### Step 1: Test the Script
1. Double-click `automate.bat` in this folder.
2. It should open a terminal, run the scraper, and (if new jobs are found) push them to GitHub.

### Step 2: Schedule it with Windows Task Scheduler
To make it run every 12 hours automatically:

1. Press `Win + R`, type `taskschd.msc` and hit Enter.
2. Click **Create Basic Task** on the right.
3. **Name**: "LinkedIn Scraper Auto".
4. **Trigger**: Select **Daily**.
5. **Start**: Set a time (e.g., 9:00 AM). Set "Recur every: 1 days".
6. **Action**: Select **Start a program**.
7. **Program/script**: Browse and select the `automate.bat` file in this folder.
   - **IMPORTANT**: In "Start in (optional)", paste the full path to this folder (e.g., `C:\Users\arkad\.gemini\antigravity\scratch\linkedin_scraper`).
8. Finish.

**To run every 12 hours:**
1. Find your task in the list, right-click -> **Properties**.
2. Go to **Triggers** tab -> Edit.
3. Check **Repeat task every**: Select `12 hours` (or type it).
4. set **for a duration of**: `Indefinitely`.
5. Click OK.

Now your computer will automatically scrape and update the website twice a day! ensure your computer is on and connected to internet.
