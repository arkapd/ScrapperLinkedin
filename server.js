const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

console.log('Initializing Server...');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'website')));

app.get('/api/jobs', (req, res) => {
    const jobsFile = path.join(__dirname, 'website', 'jobs.json');
    if (fs.existsSync(jobsFile)) {
        try {
            const jobs = JSON.parse(fs.readFileSync(jobsFile, 'utf8'));
            // Sort by timestamp desc
            jobs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            res.json(jobs);
        } catch (e) {
            res.status(500).json({ error: 'Failed to read jobs data' });
        }
    } else {
        res.json([]);
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'website', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Job Board Server running at http://localhost:${PORT}`);
});
