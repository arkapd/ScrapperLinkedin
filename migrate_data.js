const fs = require('fs');
const path = require('path');

const JOBS_FILE = path.join(__dirname, 'jobs.json');
const ARCHIVE_FILE = path.join(__dirname, 'archive.json');

function migrate() {
    console.log('Migrating data...');

    let jobs = [];
    if (fs.existsSync(JOBS_FILE)) {
        jobs = JSON.parse(fs.readFileSync(JOBS_FILE, 'utf8'));
    }

    // Save to Archive
    fs.writeFileSync(ARCHIVE_FILE, JSON.stringify(jobs, null, 2));
    console.log(`Archived ${jobs.length} jobs to archive.json`);

    // Clear jobs.json
    fs.writeFileSync(JOBS_FILE, JSON.stringify([], null, 2));
    console.log('Cleared jobs.json (Ready for fresh run)');
}

migrate();
