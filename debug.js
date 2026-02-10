const puppeteer = require('puppeteer');
const fs = require('fs');

async function debug() {
    console.log('Starting Debug...');
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--start-maximized'],
        userDataDir: './user_data'
    });

    const page = await browser.newPage();
    console.log('Navigating...');
    await page.goto('https://www.linkedin.com/feed/', { waitUntil: 'domcontentloaded' });

    console.log('Waiting 5s...');
    await new Promise(r => setTimeout(r, 5000));

    // Capture simple text content to see if search is visible
    const text = await page.evaluate(() => document.body.innerText.substring(0, 500));
    console.log('Body Text Start:', text);

    console.log('Taking screenshot...');
    await page.screenshot({ path: 'debug_screenshot.png', fullPage: true });

    console.log('Saving HTML...');
    const html = await page.content();
    fs.writeFileSync('page_dump.html', html);

    console.log('Done.');
    await browser.close();
}

debug();
