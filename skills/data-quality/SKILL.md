---
name: data-quality
description: "Job post intelligence layer for campus placement platform. Handles fresher detection logic with negative and positive regex patterns, spam filtering using keyword blocklists and gmail rejection, relevance scoring, Indian phone number and email extraction, multi-city classification for Pune Delhi Hyderabad Bangalore, and department categorization for Operations Finance Developer HR Data Science. Use when user says 'improve filtering', 'too many spam jobs', 'missed a fresher post', 'add spam keyword', 'tune detection', 'add new city', 'add new department', 'false positive', or 'false negative'. Do NOT use for frontend UI or deployment."
---

# 🧠 Data Quality & Intelligence Skill

This skill encodes the "Brain" of the Campus Placement Platform. It governs how we distinguish between high-value fresher opportunities and low-value spam or experienced listings.

## 1. The Fresher Detection Algorithm

The algorithm uses a prioritized signal system where **Negative Signals always override Positive Signals**.

### Negative Signals (REJECT IF MATCH)
- **Experience Regex**: `/(\d+)\s*\+\s*years/i`. Extract X. If X ≥ 2, reject.
- **Range Regex**: `/(\d+)\s*-\s*(\d+)\s*years/i`. Extract minimum. If min ≥ 2, reject.
- **Seniority Keywords**: `["senior", "lead", "manager", "director", "VP", "head of", "principal", "staff engineer", "minimum 3 years", "5+ years"]`.

### Positive Signals (ACCEPT IF NO NEGATIVE)
- **Keywords**: `["fresher", "freshers", "entry level", "0-1 year", "0-2 years", "batch 2024", "batch 2025", "graduate", "trainee", "intern", "apprentice", "campus hiring", "walk-in"]`.
- **Degrees**: `["B.Tech", "BBA", "MBA", "BCA", "MCA", "B.Com", "M.Com", "BE", "BSc"]`.

## 2. Spam & Quality Control

### Email Rejection
- `@gmail.com`, `@yahoo.com`, `@hotmail.com` -> REJECT (typically consultancy spam).
- Corporate domains -> ACCEPT.

### Keyword Blocklist
Located in `references/spam-blocklist.md`. Includes: `["registration fee", "pay to join", "MLM", "network marketing", "investment required"]`.

### Low-Quality Signals
- Post is entirely in CAPS.
- Post contains >3 phone numbers.
- Post length < 50 characters.

## 3. Contact Extraction

- **Email Regex**: Catches `name@company.com`, `hr@company.co.in`.
- **Phone Regex**: Catches `+91XXXXXXXXXX`, `91-XXXXXXXXXX`. Rejects numbers <10 digits.

## 4. Multi-City & Department Config
Detailed settings for Pune, Delhi, Hyderabad, and Bangalore are in `references/city-config.md`. Department keywords (Operations, Finance, Developer, HR, Data Science) are in `references/fresher-keywords.md`.

## 5. Troubleshooting
- **False Positives**: Check `references/spam-blocklist.md`. Ensure email domain filter is active.
- **False Negatives**: Expand keywords in `references/fresher-keywords.md`. Check if negative regex is too aggressive.

## Examples
- "Add 'Supply Chain' as a new department category" -> Update `references/fresher-keywords.md` and categorization logic.
- "Filter out posts mentioning 'security deposit'" -> Add to `references/spam-blocklist.md`.
- "Adjust fresher logic to allow 1.5 years experience" -> Update regex in `SKILL.md` and `references/regex-patterns.md`.
