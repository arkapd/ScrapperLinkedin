document.addEventListener('DOMContentLoaded', () => {
    const jobList = document.getElementById('jobList');
    const roleFilter = document.getElementById('roleFilter');
    const locationFilter = document.getElementById('locationFilter');


    let allJobs = [];

    // Auto-Refresh Logic
    const REFRESH_INTERVAL = 60000; // 60 seconds
    const lastUpdatedEl = document.getElementById('lastUpdated');

    function fetchJobs() {
        const timestamp = new Date().getTime();
        fetch(`jobs.json?v=${timestamp}`) // Cache busting
            .then(res => res.json())
            .then(data => {
                // simple check: if length changed or first load
                if (allJobs.length !== data.length || allJobs.length === 0) {
                    allJobs = data;
                    renderJobs(allJobs);
                    filterJobs(); // Re-apply current filters
                }
                updateLastUpdatedTime();
            })
            .catch(err => {
                console.error('Data load error:', err);
                if (allJobs.length === 0) {
                    jobList.innerHTML = '<div class="loading error-msg">Updates in progress. Please refresh in 2 minutes.</div>';
                }
            });
    }

    function updateLastUpdatedTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        if (lastUpdatedEl) {
            lastUpdatedEl.textContent = `Last updated: ${timeString}`;
        }
    }

    // Initial Load
    fetchJobs();
    setInterval(fetchJobs, REFRESH_INTERVAL);

    // Render Function
    function renderJobs(jobs) {
        jobList.innerHTML = '';
        if (jobs.length === 0) {
            jobList.innerHTML = '<div class="loading">No jobs found matching your criteria.</div>';
            return;
        }

        jobs.forEach(job => {
            const card = document.createElement('div');
            card.className = 'job-card';

            // Safe fallbacks
            const role = escapeHtml(job.role || 'Unknown Role');
            const loc = escapeHtml(job.location || 'Unknown');
            const exp = escapeHtml(job.experience || 'Any');
            const contact = escapeHtml(job.contact || 'See Post');
            const snippet = escapeHtml(cleanSnippet(job.snippet || ''));
            const link = job.link || '#';

            card.innerHTML = `
                <div class="job-header">
                    <div class="role">${role}</div>
                    <div class="badges">
                        <span class="badge location">${loc}</span>
                        ${exp !== 'Any' ? `<span class="badge exp">${exp}</span>` : ''}
                    </div>
                </div>
                <div class="contact">📞 ${contact}</div>
                <div class="snippet">${snippet}</div>
                <div class="actions">
                    <a href="${link}" target="_blank" rel="noopener noreferrer" class="apply-btn">View on LinkedIn ↗</a>
                </div>
            `;
            jobList.appendChild(card);
        });
    }

    // Filter Logic
    function filterJobs() {
        const role = roleFilter.value.toLowerCase();
        const loc = locationFilter.value.toLowerCase();

        // Hardcoded 'Fresher' constraint
        const exp = 'fresher';

        const filtered = allJobs.filter(job => {
            // Role Filter (Partial Match)
            // Handle "Developer" mapping: if user selects "IT" (value provided), match "IT" or "Developer" in data
            // Actually, dropdown value is still "IT" but text is "Developer". Let's assume data has "IT" or "Developer".
            // Simpler: Just string match.
            const matchesRole = role ? (job.role || '').toLowerCase().includes(role) || (role === 'it' && (job.role || '').toLowerCase().includes('developer')) : true;

            // Location Filter (Partial Match)
            const matchesLoc = loc ? (job.location || '').toLowerCase().includes(loc) : true;

            // Experience Filter (Strict Fresher Only)
            const jobExp = (job.experience || '').toLowerCase();
            const matchesExp = jobExp.includes(exp);

            return matchesRole && matchesLoc && matchesExp;
        });

        renderJobs(filtered);
    }

    // Event Listeners
    roleFilter.addEventListener('change', filterJobs);
    locationFilter.addEventListener('change', filterJobs);
    // experienceFilter removed

    // Helper
    function escapeHtml(text) {
        if (!text) return '';
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function cleanSnippet(text) {
        if (!text) return '';
        let cleaned = text;

        // Remove "Feed post..." header lines
        cleaned = cleaned.replace(/^Feed post.*?(\n|$)/g, '');
        cleaned = cleaned.replace(/^.*? \u2022 \d+[a-z]+ \u2022 .*?(\n|$)/g, ''); // "Name • 3rd+ • ..."

        // Remove excessive keyword dumps (heuristic: lines with many bullets or short words)
        // cleaned = cleaned.replace(/(\w+ \u2022 )+\w+/g, '');

        return cleaned.trim();
    }
});
