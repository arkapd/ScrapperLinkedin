---
name: deploy-ops
description: "Deployment and operations for campus placement platform. Covers VPS setup on DigitalOcean or Hetzner, cron job scheduling for scraper runs, environment variable management, GitHub push automation, database backups, health monitoring, and migration from local Windows Task Scheduler to cloud infrastructure. Use when user says 'deploy to production', 'set up cron', 'configure server', 'fix deployment', 'backup database', 'server is down', or 'migrate to cloud'. Do NOT use for frontend UI or scraper logic."
---

# 🚀 Deploy & Ops Skill

This skill governs the infrastructure and automation lifecycle of the platform. It covers the transition from local automation to professional cloud hosting.

## 1. Current Deployment (Local)
- **Script**: `automate.bat` (Windows Batch).
- **Scheduler**: Windows Task Scheduler (Every 12 hours).
- **Hosting**: GitHub Pages (Static frontend) + `jobs.json` artifact.

## 2. Target Server Setup
Detailed in `references/server-setup.md`.
- **Infrastructure**: DigitalOcean Droplet or Hetzner Cloud.
- **Runtime**: Node.js + PM2 (Process Management).
- **Proxy**: Nginx with Let's Encrypt SSL.

## 3. Automation & Cron
- **Local**: `automate.bat` drives Git pushes.
- **Cloud**: System `cron` or PM2 Cron Mode triggers the scraper.

## 4. Health & Monitoring
Scripts in `scripts/`:
- `health_check.py`: Verifies if the last scrape was successful and the JSON is current.
- `backup_database.sh`: Handles daily PostgreSQL dumps to AWS S3 or Local.

## 5. Migration Strategy
1. Provision VPS.
2. Clone Repo & Install dependencies.
3. Configure PM2 for persistence.
4. Set up Nginx Reverse Proxy.
5. Point DNS for college subdomains.

## Examples
- "Set up the production server on Ubuntu 22.04" -> Follow `references/server-setup.md`.
- "Why did the scraper stop running last night?" -> Run `scripts/health_check.py` and inspect PM2 logs.
- "Automate database backups to S3" -> Use `scripts/backup_database.sh`.

## Troubleshooting
- **Git Push Failed**: Check personal access tokens or SSH keys on the server.
- **Site Down (502 Bad Gateway)**: Verify Express server is running via `pm2 list`. Check Nginx config.
- **Scraper Slow**: Check CPU/RAM usage on the VPS. LinkedIn may be throttling the IP.
