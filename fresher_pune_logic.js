const puppeteer = require('puppeteer');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Trial Data Store
const WEBSITE_DIR = './website';
if (!fs.existsSync(WEBSITE_DIR)) {
    fs.mkdirSync(WEBSITE_DIR);
}
const TRIAL_FILE = path.join(WEBSITE_DIR, 'fresher_trial_data.json');
const TRIGGER_FILE = './trigger.txt';

// Configuration
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

function loadTrialData() {
    if (fs.existsSync(TRIAL_FILE)) {
        try {
            return JSON.parse(fs.readFileSync(TRIAL_FILE, 'utf8'));
        } catch (e) { return []; }
    }
    return [];
}

function saveTrialData(data) {
    fs.writeFileSync(TRIAL_FILE, JSON.stringify(data, null, 2));
}

async function main() {
    console.log('Starting Fresher Logic Trial (Multi-Location)...');

    if (fs.existsSync(TRIGGER_FILE)) fs.unlinkSync(TRIGGER_FILE);

    let trialData = loadTrialData();
    const processedUrls = new Set(trialData.map(d => d.link));

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

    // --- LOGIC: PERMUTATIONS FOR MULTIPLE LOCATIONS ---
    for (const location of LOCATIONS) {
        console.log(`\n=== POLLING LOCATION: ${location} ===`);

        for (const domain of DOMAINS) {
            const query = `${domain} fresher hiring ${location}`;

            console.log(`\n>>> Testing Logic for: "${query}"`);

            const encodedQuery = encodeURIComponent(query);
            const searchUrl = `https://www.linkedin.com/search/results/content/?datePosted=%22past-24h%22&keywords=${encodedQuery}&origin=FACETED_SEARCH&sortBy=%22date_posted%22`;

            try {
                await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
                // Randomized Human Delay after navigation (5-10 seconds)
                const randomNavDelay = Math.floor(Math.random() * 5000) + 5000;
                console.log(`Waiting ${randomNavDelay / 1000}s after navigation...`);
                await new Promise(r => setTimeout(r, randomNavDelay));
            } catch (e) {
                console.error(`Navigation failed for ${domain} in ${location}:`, e.message);
                continue;
            }

            const maxScrolls = 4;
            let scrollCount = 0;
            let domainCount = 0;

            while (scrollCount < maxScrolls) {
                // Human-like scroll: moderate speed with pauses
                await page.evaluate(() => {
                    window.scrollBy(0, window.innerHeight * 0.8);
                });

                // Randomized Scroll Delay (4-7 seconds)
                const randomScrollDelay = Math.floor(Math.random() * 3000) + 4000;
                await new Promise(r => setTimeout(r, randomScrollDelay));

                const posts = await page.$$('.feed-shared-update-v2, .reusable-search__result-container, .occludable-update');

                for (const post of posts) {
                    try {
                        // Micro-delay
                        await new Promise(r => setTimeout(r, 200));

                        const textContent = await post.evaluate(el => el.innerText);

                        // --- REFINED FRESHER VALIDATION LOGIC ---
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
                        if (processedUrls.has(normalizedUrl)) continue;

                        // Extract Contact
                        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
                        const phoneRegex = /(?:\+91[\-\s]?)?[6789]\d{9}/g;
                        const emails = textContent.match(emailRegex);
                        const phones = textContent.match(phoneRegex);

                        const hasContact = emails || phones;
                        const contactInfo = [...(emails || []), ...(phones || [])].join(', ');

                        if (hasContact) {
                            console.log(`   [MATCH] ${domain} Fresher in ${location}: ${normalizedUrl}`);

                            trialData.push({
                                id: Math.random().toString(36).substr(2, 9),
                                role: domain,
                                location: location,
                                experience: 'Fresher',
                                contact: contactInfo,
                                link: normalizedUrl,
                                snippet: textContent.substring(0, 300),
                                timestamp: new Date().toISOString(),
                                queryUsed: query
                            });
                            saveTrialData(trialData);
                            processedUrls.add(normalizedUrl);
                            domainCount++;
                        }
                    } catch (e) { }
                }
                scrollCount++;
            }
            console.log(`   > Found ${domainCount} candidates for ${domain} in ${location}`);
        }
    }

    console.log(`\nTrial Complete. Data saved to ${TRIAL_FILE}`);
    await new Promise(r => setTimeout(r, 600000)); // Keep open for review
}

function isFresherRelevant(text) {
    const t = text.toLowerCase();

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

    const positiveSignals = [
        'fresher', 'freshers', 'entry level', 'graduate', 'trainee', 'intern',
        '0-1 year', '0-2 year', '0 to 1 year', '0 to 2 year', 'no experience',
        '2023 batch', '2024 batch', '2025 batch', 'passing out'
    ];

    if (positiveSignals.some(s => t.includes(s))) return true;

    return true;
}

main().catch(console.error);
