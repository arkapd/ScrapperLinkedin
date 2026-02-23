### 🗺️ API Route Map

#### Public Routes
- `GET /api/jobs`: List approved jobs (supports `city`, `domain` filters).
- `GET /api/jobs/:id`: Get full job details.
- `POST /api/auth/otp`: Generate and send OTP.
- `POST /api/auth/verify`: Verify OTP and return JWT.

#### Student Routes (Auth Required)
- `GET /api/profile`: Get student profile.
- `PUT /api/profile`: Update profile/resume.
- `POST /api/jobs/:id/apply`: Submit application for a job.

#### Admin Routes (Admin Auth Required)
- `GET /api/admin/pending`: List jobs awaiting approval.
- `PATCH /api/admin/jobs/:id`: Approve/Reject/Score a job.
- `POST /api/admin/jobs`: Manually post a job.
- `GET /api/admin/analytics`: Dashboard metrics.
