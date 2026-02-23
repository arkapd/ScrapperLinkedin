### 🔢 Shared Regex Library

#### 1. Email Extraction (Corporate)
`/[a-zA-Z0-9._%+-]+@(?!(?:gmail|yahoo|hotmail|outlook|rediffmail)\.com)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i`
*Catches business emails, excludes public spam domains.*

#### 2. Indian Phone Numbers
`/(?:\+91|91)?[6789]\d{9}/g`
*Matches common Indian mobile formats.*

#### 3. Experience Flag (Negative)
`/(\d+)\s*\+\s*years/i`
*Used to reject senior roles during extraction.*
