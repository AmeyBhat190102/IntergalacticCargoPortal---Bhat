# Intergalactic Cargo Portal

A full-stack portal with Authentication and RBAC for managing legacy cargo manifests.

**Stack:** FastAPI · psycopg2 · PostgreSQL · React · Vite · TailwindCSS

---

## Local Setup

### 1. Clone the repo

```bash
git clone https://github.com/AmeyBhat190102/IntergalacticCargoPortal---Bhat
```

### 2. Set up the database

Connect to PostgreSQL and run:

```sql
CREATE USER cargo_user WITH PASSWORD 'cargo_pass';
CREATE DATABASE intergalactic_cargo OWNER cargo_user;
```

Then create the tables with .sql file present in `backend/app/models`:

```bash
psql -U cargo_user -d intergalactic_cargo -f schema.sql
```

### 3. Configure backend environment

```bash
cp backend/.env.example backend/.env
```

`backend/.env` should look like this:

```env
DATABASE_URL=postgresql://cargo_user:cargo_pass@localhost:5432/intergalactic_cargo
SECRET_KEY=change-this-to-a-random-32-char-string
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
ALLOWED_ORIGINS=http://localhost:5173
```

### 4. Install backend dependencies and run

```bash
cd backend
uv sync
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Backend runs at: `http://localhost:8000`
Swagger docs at: `http://localhost:8000/docs`

### 5. Install frontend dependencies and run

```bash
# In a new terminal
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## Creating Users

**Admin user** (email must end exactly with `@nebula-corp.com`):

```bash
curl -X POST http://localhost:8000/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "commander@nebula-corp.com", "password": "password123"}'
```

**Standard user:**

```bash
curl -X POST http://localhost:8000/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "crew@gmail.com", "password": "password123"}'
```

## Uploading the Manifest

Login as admin via the portal, then use the Upload Manifest button on the dashboard.

Or via cURL:

```bash
curl -X POST http://localhost:8000/api/upload \
  -H "Authorization: Bearer <your_admin_token>" \
  -F "file=@manifest.txt"
```

---

## Role Behaviour

| Feature              | Admin | Standard         |
| -------------------- | ----- | ---------------- |
| Upload manifest      | ✅    | ✗ (403)          |
| View cargo table     | ✅    | ✅               |
| Weight unit          | KG    | LBS              |
| Upload button in DOM | ✅    | ✗ (not rendered) |

---

## Business Logic

- Emails ending exactly in `@nebula-corp.com` receive **Admin** role — assigned server-side only, never from client
- Cargo destined for **Sector-7**: weight × 1.45, rounded to nearest whole number
- If rounded weight is a **prime number**, the record is discarded and not saved
- Table sorted **heaviest → lightest**; Earth always pinned to absolute bottom regardless of weight
