const puppeteer = require('puppeteer');
require('dotenv').config();
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Web Platform Data Store
const WEBSITE_DIR = './website';
if (!fs.existsSync(WEBSITE_DIR)) {
    fs.mkdirSync(WEBSITE_DIR);
}
const JOBS_FILE = path.join(WEBSITE_DIR, 'jobs.json');

// Configuration
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const CREDENTIALS_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS || './credentials.json';
const TRIGGER_FILE = './trigger.txt';

// --- ADVANCED SEARCH CONFIGURATION ---
const DOMAINS = [
    'Operations',
    'Finance',
    'Data Science',
    'IT Tech',
    'HR',
    'Supply Chain',
    'Developer'
];
const LOCATIONS = [
    'Pune',
    'Delhi NCR',
    'Hyderabad',
    'Bangalore'
];

// Helper to wait for trigger file
async function waitForTrigger(message) {
    if (fs.existsSync(TRIGGER_FILE)) fs.unlinkSync(TRIGGER_FILE);
    console.log(message);
    const startTime = Date.now();
    const timeout = 300000; // 5 minutes

    while (Date.now() - startTime < timeout) {
        if (fs.existsSync(TRIGGER_FILE)) {
            console.log('Trigger detected! Proceeding...');
            try { fs.unlinkSync(TRIGGER_FILE); } catch (e) { }
            return true;
        }
        await new Promise(r => setTimeout(r, 1000));
    }
    return false;
}

// --- Helper Functions for Local Data Store ---
function loadJobs() {
    if (fs.existsSync(JOBS_FILE)) {
        try {
            return JSON.parse(fs.readFileSync(JOBS_FILE, 'utf8'));
        } catch (e) {
            return [];
        }
    }
    return [];
}

function saveJobs(jobs) {
    fs.writeFileSync(JOBS_FILE, JSON.stringify(jobs, null, 2));
}

// Google Sheets Setup
async function getExistingUrls() {
    if (!SPREADSHEET_ID) return new Set();
    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: CREDENTIALS_PATH,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });
        const client = await auth.getClient();
        const sheets = google.sheets({ version: 'v4', auth: client });

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Sheet1!B:B', // Assuming Post URL is in Column B
        });

        const rows = response.data.values;
        if (!rows || rows.length === 0) return new Set();

        const urls = new Set(rows.flat().map(url => url.split('?')[0]));
        console.log(`Fetched ${urls.size} existing URLs from sheet.`);
        return urls;
    } catch (error) {
        console.error('Error fetching existing URLs:', error.message);
        return new Set();
    }
}

async function appendToSheet(data) {
    if (!SPREADSHEET_ID) {
        return;
    }
    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: CREDENTIALS_PATH,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });
        const client = await auth.getClient();
        const sheets = google.sheets({ version: 'v4', auth: client });

        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Sheet1!A:G',
            valueInputOption: 'USER_ENTERED',
            resource: { values: [data] },
        });
        console.log('Data appended to sheet.');
    } catch (error) {
        console.error('Error appending to sheet:', error.message);
    }
}

async function main() {
    console.log('Starting LinkedIn Scraper v3.0 (Multi-Location Fresher Logic)...');

    if (fs.existsSync(TRIGGER_FILE)) fs.unlinkSync(TRIGGER_FILE);

    // Initialize Local Data
    let localJobs = loadJobs();
    const existingUrls = await getExistingUrls();

    // Add local JSON urls to dedupe set
    localJobs.forEach(job => existingUrls.add(job.link));

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--start-maximized'],
        userDataDir: './user_data'
    });

    const page = await browser.newPage();

    console.log('Navigating to LinkedIn...');
    try {
        await page.goto('https://www.linkedin.com/feed/', { waitUntil: 'domcontentloaded' });
    } catch (e) {
        console.error('Navigation failed:', e);
    }

    // Login Check
    let loggedIn = false;
    try {
        await page.waitForSelector('.global-nav__me-photo, #global-nav-typeahead, input[data-view-name="search-global-typeahead-input"]', { timeout: 10000 });
        console.log('Login detected automatically!');
        loggedIn = true;
    } catch (e) { }

    if (!loggedIn) {
        await waitForTrigger(`Waiting for login... Create "${TRIGGER_FILE}" to proceed.`);
    }

    // --- MAIN SCRAPING LOOP ---
    for (const location of LOCATIONS) {
        console.log(`\n=== POLLING LOCATION: ${location} ===`);

        for (const domain of DOMAINS) {
            // Construct Query: "Role fresher hiring Location"
            const query = `${domain} fresher hiring ${location}`;

            console.log(`\n>>> Executing Search: "${query}"`);

            const encodedQuery = encodeURIComponent(query);
            const searchUrl = `https://www.linkedin.com/search/results/content/?datePosted=%22past-24h%22&keywords=${encodedQuery}&origin=FACETED_SEARCH&sortBy=%22date_posted%22`;

            try {
                await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

                // Random Navigation Delay (5-10s)
                const randomNavDelay = Math.floor(Math.random() * 5000) + 5000;
                console.log(`   Waiting ${randomNavDelay / 1000}s...`);
                await new Promise(r => setTimeout(r, randomNavDelay));
            } catch (e) {
                console.error(`   Navigation failed for ${domain} in ${location}:`, e.message);
                continue;
            }

            const maxScrolls = 4;
            let scrollCount = 0;
            let domainCount = 0;

            while (scrollCount < maxScrolls) {
                await page.evaluate(() => {
                    window.scrollBy(0, window.innerHeight * 0.8);
                });

                // Random Scroll Delay (4-7s)
                const randomScrollDelay = Math.floor(Math.random() * 3000) + 4000;
                await new Promise(r => setTimeout(r, randomScrollDelay));

                const posts = await page.$$('.feed-shared-update-v2, .reusable-search__result-container, .occludable-update');

                for (const post of posts) {
                    try {
                        await new Promise(r => setTimeout(r, 200)); // Micro-pause

                        const textContent = await post.evaluate(el => el.innerText);

                        // --- STRICT FRESHER VALIDATION ---
                        if (!isFresherRelevant(textContent)) {
                            continue;
                        }

                        // Extract URL
                        const urn = await post.evaluate(el => el.getAttribute('data-urn'));
                        let postUrl = await post.evaluate(el => {
                            const links = Array.from(el.querySelectorAll('a'));
                            const activityLink = links.find(l => l.href.includes('urn:li:activity') || l.href.includes('/posts/') || l.href.includes('/feed/update/'));
                            return activityLink ? activityLink.href : null;
                        });
                        if (!postUrl && urn) postUrl = `https://www.linkedin.com/feed/update/${urn}`;
                        if (!postUrl) postUrl = 'N/A';

                        const normalizedUrl = postUrl.split('?')[0];
                        if (existingUrls.has(normalizedUrl)) continue;

                        // Extract Contact Info
                        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
                        const phoneRegex = /(?:\+91[\-\s]?)?[6789]\d{9}/g;
                        const emails = textContent.match(emailRegex);

                        // GMAIL FILTER: Exclude posts with @gmail.com
                        if (emails && emails.some(e => e.toLowerCase().includes('@gmail.com'))) {
                            continue;
                        }

                        const phones = textContent.match(phoneRegex);
                        const hasContact = emails || phones;
                        const contactInfo = [...(emails || []), ...(phones || [])].join(', ');

                        if (hasContact) {
                            console.log(`   [NEW MATCH] ${domain} in ${location}`);

                            const jobEntry = {
                                id: Math.random().toString(36).substr(2, 9),
                                role: domain,
                                location: location,
                                experience: 'Fresher',
                                contact: contactInfo,
                                link: normalizedUrl,
                                snippet: textContent.substring(0, 300),
                                timestamp: new Date().toISOString(),
                                queryUsed: query
                            };

                            localJobs.push(jobEntry);
                            existingUrls.add(normalizedUrl);

                            // Save immediately
                            saveJobs(localJobs);

                            // Optional: Append to Google Sheets if configured
                            try {
                                if (false) { // Disabled for now to focus on local
                                    await sheets.spreadsheets.values.append({
                                        spreadsheetId: SPREADSHEET_ID,
                                        range: 'Sheet1!A:G',
                                        valueInputOption: 'USER_ENTERED',
                                        resource: {
                                            values: [[
                                                jobEntry.role, jobEntry.location, jobEntry.experience,
                                                jobEntry.contact, jobEntry.link, jobEntry.snippet, jobEntry.timestamp
                                            ]]
                                        },
                                    });
                                }
                            } catch (e) { }

                            domainCount++;
                        }
                    } catch (e) { }
                }
                scrollCount++;
            }
            console.log(`   > Scraped ${domainCount} jobs for ${domain} in ${location}`);
        }
    }

    console.log(`\nScraping Cycle Complete. Total Jobs: ${localJobs.length}`);
    // Keep browser open for a bit
    await new Promise(r => setTimeout(r, 60000));
}

function isFresherRelevant(text) {
    const t = text.toLowerCase();

    // Negative Signals
    const expReqRegex = /(?:min|minimum|at least|experience)\s*(?:required)?\s*[:\-]?\s*(\d+)(?:\+|\s*plus)?\s*years/i;
    const match = t.match(expReqRegex);
    if (match && match[1]) {
        const years = parseInt(match[1]);
        if (years > 0) return false;
    }

    const xPlusRegex = /(\d+)\s*\+\s*years/i;
    const xPlusMatch = t.match(xPlusRegex);
    if (xPlusMatch && xPlusMatch[1]) {
        const years = parseInt(xPlusMatch[1]);
        if (years >= 2) return false;
    }

    // Positive Signals
    const positiveSignals = [
        'fresher', 'freshers', 'entry level', 'graduate', 'trainee', 'intern',
        '0-1 year', '0-2 year', '0 to 1 year', '0 to 2 year', 'no experience',
        '2023 batch', '2024 batch', '2025 batch', 'passing out'
    ];

    if (positiveSignals.some(s => t.includes(s))) return true;

    return true;
}

main().catch(console.error);
