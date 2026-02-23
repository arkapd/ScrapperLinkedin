### 🔍 Regex Library

#### 1. Experience Check (Negative)
- **Regex**: `/(\d+)\s*\+\s*years/i`
- **Purpose**: Detects specific years of experience requirements.
- **Logic**: Extract the digit. If ≥ 2, reject as "Not a Fresher" role.

#### 2. Experience Range (Negative)
- **Regex**: `/(\d+)\s*-\s*(\d+)\s*years/i`
- **Purpose**: Detects ranges (e.g., "3-5 years").
- **Logic**: Extract the first digit (minimum). If ≥ 2, reject.

#### 3. Email Extraction
- **Regex**: `/[a-zA-Z0-9._%+-]+@(?!(?:gmail|yahoo|hotmail|outlook|rediffmail)\.com)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i`
- **Purpose**: Extracts corporate emails while skipping free/spam domains.

#### 4. Indian Phone Numbers
- **Regex**: `/(?:\+91|91)?[6789]\d{9}/g`
- **Purpose**: Captures valid Indian mobile numbers.
