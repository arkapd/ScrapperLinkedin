### 🗄️ Database Schema (Relational)

#### Table: `jobs`
- `id`: UUID (Primary Key)
- `title`: String
- `company`: String
- `location`: String
- `department`: String
- `contact_email`: String
- `contact_phone`: String
- `description`: Text
- `status`: Enum (Pending, Approved, Rejected)
- `relevance_score`: Integer (0-100)
- `scraped_at`: Timestamp

#### Table: `students`
- `id`: UUID (Primary Key)
- `email`: String (Unique)
- `name`: String
- `college_id`: UUID (Foreign Key)
- `resume_url`: String

#### Table: `colleges`
- `id`: UUID (Primary Key)
- `subdomain`: String (Unique)
- `branding_config`: JSON (Colors, Logos)
- `plan`: Enum (Free, Pro)
