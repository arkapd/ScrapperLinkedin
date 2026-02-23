### 🔑 Authentication Flow

#### 1. OTP Generation
1. Client POSTs email to `/api/auth/otp`.
2. Server validates email exists in `students` or is a new signup.
3. Server generates 6-digit code, stores it in Redis (TTL: 5 mins).
4. Server sends code via Email.

#### 2. Verification
1. Client POSTs email + code to `/api/auth/verify`.
2. Server checks Redis.
3. On match, Server generates JWT:
   ```json
   {
     "userId": "123",
     "role": "student",
     "collegeId": "456",
     "exp": 1728394050
   }
   ```
4. Client stores JWT in `localStorage` or `HttpOnly` cookie.
