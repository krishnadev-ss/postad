# POSTAD - Out-of-Home Advertising Platform

POSTAD is a production-ready MVP platform connecting advertisers with out-of-home (OOH) advertising spaces like billboards, digital screens, bus shelters, and more.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite + TailwindCSS + Zustand |
| Backend | NestJS (TypeScript) |
| Database | PostgreSQL 15 |
| ORM | Prisma |
| Auth | JWT (RS256 via passport-jwt) |
| Containerization | Docker + Docker Compose |

## Project Structure

```
postad/
├── apps/
│   ├── web/          # React frontend (Vite + TSX)
│   └── api/          # NestJS backend
├── packages/
│   └── types/        # Shared TypeScript types
├── docker-compose.yml
└── .env.example
```

## Prerequisites

- Node.js 18+
- npm or yarn
- Docker & Docker Compose
- Git

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repo-url>
cd postad
```

### 2. Set up environment variables

```bash
# Copy example env file for the API
cp .env.example apps/api/.env
```

Edit `apps/api/.env` and set your values:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postad
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
PORT=3001
```

### 3. Start PostgreSQL with Docker

```bash
docker-compose up -d
```

Verify it's running:
```bash
docker-compose ps
```

### 4. Install backend dependencies

```bash
cd apps/api
npm install
```

### 5. Run Prisma migrations

```bash
# From apps/api directory
npx prisma generate
npx prisma migrate dev --name init
```

### 6. Seed the database

```bash
# From apps/api directory
npm run seed
```

### 7. Start the backend server

```bash
# From apps/api directory
npm run start:dev
```

The API will be available at: `http://localhost:3001/api`

### 8. Install frontend dependencies

```bash
# From a new terminal, go to apps/web
cd apps/web
npm install
```

### 9. Start the frontend dev server

```bash
# From apps/web directory
npm run dev
```

The frontend will be available at: `http://localhost:5173`

## Default Credentials

After seeding, these accounts are available:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@postad.com | Admin@123 |
| Provider | provider@postad.com | Provider@123 |
| Advertiser | advertiser@postad.com | Advertiser@123 |

## API Documentation

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "ADVERTISER"  // ADMIN | ADVERTISER | PROVIDER
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Returns: `{ user: {...}, access_token: "jwt_token" }`

### Ad Spaces

#### List all ad spaces (with optional filters)
```http
GET /api/adspaces?location=New York&type=Billboard&minPrice=100&maxPrice=5000&isAvailable=true
```

#### Get single ad space
```http
GET /api/adspaces/:id
```

#### Create ad space (PROVIDER or ADMIN only)
```http
POST /api/adspaces
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Downtown Billboard",
  "location": "Main St, New York, NY",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "type": "Billboard",
  "price_per_day": 1500,
  "is_available": true
}
```

#### Update ad space (PROVIDER or ADMIN only)
```http
PATCH /api/adspaces/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "price_per_day": 2000,
  "is_available": false
}
```

### Bookings

#### Create booking (ADVERTISER or ADMIN)
```http
POST /api/bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "adspace_id": "uuid",
  "start_date": "2026-07-01",
  "end_date": "2026-07-31"
}
```

#### Get my bookings
```http
GET /api/bookings/user
Authorization: Bearer <token>
```

#### Get all bookings (ADMIN only)
```http
GET /api/bookings/admin?page=1&limit=20
Authorization: Bearer <token>
```

#### Update booking status (ADMIN only)
```http
PATCH /api/bookings/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "APPROVED"  // APPROVED | REJECTED
}
```

### Activities

#### Get activities
```http
GET /api/activities?page=1&limit=20
Authorization: Bearer <token>
```
- Admin sees all activities
- Other roles see only their own activities

### Admin

#### Get dashboard stats (ADMIN only)
```http
GET /api/admin/dashboard
Authorization: Bearer <token>
```

## Business Logic

- **Bookings** always start with `PENDING` status
- Only **ADMIN** users can approve or reject bookings
- **PROVIDER** users must create a provider profile before listing ad spaces
- Activities are automatically logged for: user registration, booking creation, booking status changes, and ad space creation
- Role-based access control enforced at both API and frontend levels

## Roles & Permissions

| Action | ADMIN | PROVIDER | ADVERTISER |
|--------|-------|----------|------------|
| Browse ad spaces | ✅ | ✅ | ✅ |
| Create ad space | ✅ | ✅ | ❌ |
| Update ad space | ✅ | Own only | ❌ |
| Create booking | ✅ | ❌ | ✅ |
| View own bookings | ✅ | ❌ | ✅ |
| View all bookings | ✅ | ❌ | ❌ |
| Approve/reject booking | ✅ | ❌ | ❌ |
| Admin dashboard | ✅ | ❌ | ❌ |

## Development

### Running Prisma Studio (DB browser)
```bash
cd apps/api
npx prisma studio
```
Opens at: `http://localhost:5555`

### Rebuilding after schema changes
```bash
cd apps/api
npx prisma migrate dev --name <migration_name>
npx prisma generate
```

### Build for production
```bash
# Backend
cd apps/api
npm run build
node dist/main.js

# Frontend
cd apps/web
npm run build
# Serve dist/ with any static file server
```

## License

MIT
