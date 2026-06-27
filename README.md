# 💰 Finance Dashboard

A full-stack personal finance management application with role-based access control, JWT authentication, and real-time analytics.

![Java](https://img.shields.io/badge/Java-17-ED8B00?style=flat-square&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2-6DB33F?style=flat-square&logo=spring-boot&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

---

## 📁 Repository Structure

```
Finance-data-main/
├── finanace-data/          # ☕ Backend — Spring Boot REST API
│   ├── src/
│   │   └── main/
│   │       ├── java/com/finance/dashboard/
│   │       │   ├── controller/     # REST endpoints
│   │       │   ├── service/        # Business logic
│   │       │   ├── entity/         # JPA entities (User, Transaction)
│   │       │   ├── dto/            # Request / Response objects
│   │       │   ├── repository/     # Spring Data repositories
│   │       │   ├── security/       # JWT & Spring Security config
│   │       │   ├── exception/      # Global error handling
│   │       │   └── config/         # CORS, data seeder, beans
│   │       └── resources/
│   │           └── application.properties
│   └── pom.xml
│
├── finance-frontend/       # ⚛️  Frontend — React + Vite SPA
│   ├── src/
│   │   ├── api/            # Axios instance & service modules
│   │   ├── components/     # Reusable UI & layout components
│   │   ├── pages/          # Page-level React components
│   │   ├── routes/         # React Router configuration
│   │   ├── store/          # Zustand state (auth)
│   │   └── utils/          # Shared helpers
│   ├── .env.example        # Frontend env template
│   └── package.json
│
├── .env.example            # Root env template (covers both sub-projects)
├── .gitignore              # Root gitignore (Java + Node + secrets)
└── README.md               # ← You are here
```

---

## ✨ Features

| Feature | Details |
|---------|---------|
| 🔐 JWT Authentication | HS512 signed tokens, 24h expiry |
| 👥 Role-Based Access Control | VIEWER / ANALYST / ADMIN roles |
| 💸 Transaction Management | Full CRUD — income & expense |
| 📊 Financial Analytics | Category breakdown, net balance, summaries |
| 🔎 Advanced Filtering | Filter by type, category, date range |
| 🛡️ Input Validation | Server-side validation on all requests |
| 🗄️ Embedded Database | H2 (zero-config for local dev) |
| 🐳 Docker Ready | Dockerfile + docker-compose included |

---

## 🚀 Quick Start

### Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Java | 17+ | `java -version` |
| Maven | 3.6+ | `mvn -version` |
| Node.js | 18+ | `node -v` |
| npm | 9+ | `npm -v` |

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/Finance-data-main.git
cd Finance-data-main
```

---

### 2️⃣ Configure Environment Variables

```bash
# Copy the template
cp .env.example .env
```

Edit `.env` and set your values (see [Environment Variables](#-environment-variables) below).

> ⚠️ **Never commit `.env` to Git.** It is already in `.gitignore`.

---

### 3️⃣ Start the Backend

```bash
cd finanace-data

# Option A — Maven (development)
mvn spring-boot:run

# Option B — Build JAR and run
mvn clean package -DskipTests
java -jar target/finance-dashboard-1.0.0.jar
```

Backend will be available at: **`http://localhost:8080/api`**

---

### 4️⃣ Start the Frontend

```bash
cd finance-frontend

# Install dependencies (first time only)
npm install

# Copy env template
cp .env.example .env

# Start dev server
npm run dev
```

Frontend will be available at: **`http://localhost:5173`**

---

### 5️⃣ Docker (Optional)

Run both services with Docker Compose:

```bash
cd finanace-data
mvn clean package -DskipTests
docker-compose up -d
```

---

## 🔑 Environment Variables

Create a `.env` file at the **root** of the repo (or set these in your deployment environment):

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `JWT_SECRET` | ✅ **Yes** | *(insecure fallback)* | JWT signing key — **min 64 chars**. Generate with: `openssl rand -hex 64` |
| `JWT_EXPIRATION` | No | `86400000` | Token TTL in ms (default = 24 hours) |
| `PORT` | No | `8080` | Backend server port |
| `VITE_API_BASE_URL` | No | `http://localhost:8080/api` | Backend URL used by the frontend |

For the **frontend**, also create `finance-frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

> 💡 See `.env.example` and `finance-frontend/.env.example` for full templates.

---

## 👥 Default Test Accounts

The application seeds 3 test users automatically on first startup **(development only)**:

| Username | Password | Role | Access |
|----------|----------|------|--------|
| `admin` | `Admin@123` | ADMIN | Full access — manage users, all transactions |
| `analyst` | `Analyst@123` | ANALYST | View analytics, create transactions |
| `viewer` | `Viewer@123` | VIEWER | View own transactions only |

Each account is pre-loaded with **5 sample transactions** (2 income, 3 expense).

> 🔐 **Change these passwords** in production or disable the data seeder.

---

## 📚 API Reference

Base URL: `http://localhost:8080/api`

All protected endpoints require the header:
```
Authorization: Bearer <your-jwt-token>
```

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/login` | ❌ | Login — returns JWT token |
| `POST` | `/auth/register` | ❌ | Register new user |

**Login request:**
```json
POST /auth/login
{
  "username": "admin",
  "password": "Admin@123"
}
```

**Login response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGci...",
    "username": "admin",
    "role": "ADMIN",
    "userId": 1
  }
}
```

---

### Transactions

| Method | Endpoint | Role Required | Description |
|--------|----------|---------------|-------------|
| `GET` | `/transactions/{userId}` | VIEWER+ | List transactions (supports filters) |
| `POST` | `/transactions` | ANALYST+ | Create a transaction |
| `PUT` | `/transactions/{userId}/{id}` | ANALYST+ | Update a transaction |
| `DELETE` | `/transactions/{userId}/{id}` | ADMIN | Delete a transaction |

**Query filters for GET `/transactions/{userId}`:**

| Param | Example | Description |
|-------|---------|-------------|
| `type` | `INCOME` or `EXPENSE` | Filter by transaction type |
| `category` | `Food` | Filter by category name |
| `startDate` | `2024-01-01` | Filter from date (YYYY-MM-DD) |
| `endDate` | `2024-12-31` | Filter to date (YYYY-MM-DD) |

---

### Dashboard (ANALYST+)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/dashboard/{userId}/summary` | Total income, expenses, net balance, count |
| `GET` | `/dashboard/{userId}/categories` | Spending breakdown by category |

---

### User Management (ADMIN only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/users` | List all users |
| `GET` | `/users/{id}` | Get user by ID |
| `PUT` | `/users/{id}` | Update user |
| `DELETE` | `/users/{id}` | Soft-delete user |

---

## 🛠️ Tech Stack

### Backend (`finanace-data/`)

| Technology | Version | Purpose |
|------------|---------|---------|
| Java | 17 | Language |
| Spring Boot | 3.2.0 | Framework |
| Spring Security | 6.x | Authentication & authorization |
| JJWT | 0.12.3 | JWT generation & validation |
| Spring Data JPA | — | ORM layer |
| Hibernate | — | JPA implementation |
| H2 Database | — | Embedded in-memory DB (dev) |
| Lombok | — | Boilerplate reduction |
| Maven | 3.6+ | Build tool |

### Frontend (`finance-frontend/`)

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18 | UI framework |
| Vite | 5 | Build tool & dev server |
| TypeScript | 5 | Type safety |
| React Router | 7 | Client-side routing |
| Zustand | 5 | Global state management |
| Axios | 1 | HTTP client |
| Recharts | 3 | Charts & analytics |
| React Hook Form | 7 | Form handling |
| TailwindCSS | 4 | Utility-first styling |
| Lucide React | — | Icons |
| React Hot Toast | — | Notifications |

---

## 🔐 Security Notes

- **JWT Secret**: Must be set via `JWT_SECRET` environment variable. The fallback default is **not safe for production**.
- **Passwords**: Hashed with BCrypt. Never stored in plain text.
- **CORS**: Configured to accept requests from any origin (suitable for development). Restrict in production.
- **Soft Delete**: Users are marked `DELETED` — never hard-deleted from the database.
- **Role Enforcement**: Applied both at the controller level (`@PreAuthorize`) and service level.

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| `401 Unauthorized` | Token missing or expired — login again |
| `403 Forbidden` | Your role lacks permission — use admin account |
| `Cannot connect to database` | H2 is embedded — ensure app started without errors |
| Frontend can't reach API | Check `VITE_API_BASE_URL` in `finance-frontend/.env` |
| Port already in use | Change `PORT` env var or `server.port` in `application.properties` |

---

## 📝 License

MIT License — free to use, modify, and distribute.

---

**Built with ❤️ using Spring Boot + React**
