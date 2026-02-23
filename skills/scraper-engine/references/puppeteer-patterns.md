### 🤖 Interaction Patterns

#### 1. Page Wait Strategy
- **Wait for Network**: `await page.waitForNetworkIdle({ idleTime: 1000 })`.
- **Wait for Selector**: `await page.waitForSelector('.job-card', { timeout: 30000 })`.

#### 2. Infinite Scroll Logic
Wait for a randomized duration before scrolling to mimic human browsing.
```javascript
const scrollAmount = Math.floor(Math.random() * 500) + 200;
await page.evaluate((y) => window.scrollBy(0, y), scrollAmount);
```

#### 3. Session Persistence
Always use a `userDataDir` to keep login cookies alive. 
```javascript
const browser = await puppeteer.launch({
    headless: false,
    userDataDir: './user_data'
});
```
This follows the pattern where the user logs in manually once, and the bot resumes sessions automatically in future runs.
