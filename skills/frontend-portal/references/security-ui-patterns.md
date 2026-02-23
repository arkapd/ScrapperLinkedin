### 🛡️ Security Best Practices

#### 1. Content Security Policy (CSP)
Current policy in `index.html`:
`default-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; ...`
*Prevents loading of malicious external scripts.*

#### 2. XSS Prevention
Always use the `escapeHtml` function before setting `innerHTML`:
```javascript
function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;")...
}
```

#### 3. Privacy Attributes
- `rel="noopener noreferrer"`: Added to all external Job Links to prevent reverse tabnabbing and hide referrer data from LinkedIn.
