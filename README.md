# 💰 Finance Dashboard - Backend API

A simple and powerful REST API backend for managing personal finances with role-based access control and JWT authentication.

## 🎯 What Can You Do?

This Spring Boot application helps you:
- 📝 Create user accounts and manage your profile
- 💸 Track all your income and expense transactions
- 📊 View financial summaries (total income, expenses, and net balance)
- 📈 See category breakdowns of your spending
- 🔐 Control access based on user roles (Viewer, Analyst, Admin)

## 🚀 Quick Start (5 Minutes)

### Prerequisites
- **Java 17+** installed on your computer
- **Maven 3.6+** for building the project
- ✅ **No external database needed!** (uses H2 embedded database)

### Step-by-Step Setup

1. **Clone or download this project**
   ```bash
   cd your-project-folder
   ```

2. **Build the project**
   ```bash
   mvn clean package
   ```

3. **Start the application**
   ```bash
   mvn spring-boot:run
   ```

4. **Server is ready!**
   - **Local Access**: `http://localhost:8080/api` (same computer)
   - **Network Access**: `http://<your-ip>:8080/api` (from other computers)
   - Database: **H2 embedded** (runs inside the application)
   - All data stored in memory (resets when app restarts)
   - No external database server needed! 🚀

---

## 🌍 Access from Anywhere

The application is configured to accept connections from **any machine** on your network!

### ✅ Cross-Origin Resource Sharing (CORS) Enabled

The API allows requests from **any origin** (domain, IP, etc.):
- ✅ Works with frontend apps from any domain
- ✅ All HTTP methods supported (GET, POST, PUT, DELETE, OPTIONS, PATCH)
- ✅ All headers allowed
- ✅ Credentials supported
- ✅ Perfect for cloud deployments and third-party integrations

**Example**: A frontend app on `http://example.com` can call:
```javascript
fetch('http://192.168.1.100:8080/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: 'Admin@123' })
})
```

### Find Your Server's IP Address

**On Windows:**
```powershell
ipconfig
# Look for "IPv4 Address" under your network adapter
# Example: 192.168.1.100
```

**On Mac/Linux:**
```bash
ifconfig
# Or
hostname -I
```

### Access URLs

| Location | URL |
|----------|-----|
| **Same Computer** | `http://localhost:8080/api` |
| **Same Network** | `http://192.168.1.100:8080/api` |
| **From Anywhere** | `http://<your-public-ip>:8080/api` |

### Example:
If your IP is `192.168.1.100`, login from another computer:
```
POST http://192.168.1.100:8080/api/auth/login
```

---

## 🎬 Getting Started with Dummy Data

The application comes with **pre-loaded test data** to help you explore immediately:

### 👥 Pre-Created Test Accounts

The system automatically creates 3 test users with sample transactions when it starts:

| Username | Password | Role | Access Level |
|----------|----------|------|--------------|
| **admin** | Admin@123 | ADMIN | Full access - manage everything |
| **analyst** | Analyst@123 | ANALYST | View & create transactions, see analytics |
| **viewer** | Viewer@123 | VIEWER | View only - read transactions |

### 📋 What's In the Dummy Data?

Each test account comes with **5 pre-loaded transactions**:
- 💰 2 Income transactions (Salary, Freelance work)
- 💸 3 Expense transactions (Food, Utilities, Transport)

This allows you to immediately test the dashboard, analytics, and filtering features!

---

## 🔐 User Roles & What They Can Do

| Role | Features |
|------|----------|
| **👁️ Viewer** | ✓ View their own transactions only |
| **📊 Analyst** | ✓ View all analytics<br>✓ Create new transactions<br>✓ See category breakdowns<br>✗ Cannot manage users |
| **⚙️ Admin** | ✓ Full access - everything!<br>✓ Manage all users<br>✓ Delete any transaction<br>✓ Access all dashboards |

---

## 🧪 Testing the API with Postman

### 📥 Quick Setup: Download Postman

1. Download [Postman](https://www.postman.com/downloads/) (free version)
2. Open Postman and create a new request

---

### 1️⃣ Generate Your JWT Token (Login)

Follow these steps in Postman:

**Step 1: Create a new request**
- Click **+ New** → **Request**
- Name it: "Login"

**Step 2: Set request details**
- Method: **POST**
- URL: `http://localhost:8080/api/auth/login`

**Step 3: Add request body**
- Click **Body** tab
- Select **raw** → **JSON**
- Paste this:
```json
{
  "username": "admin",
  "password": "Admin@123"
}
```

**Step 4: Send the request**
- Click **Send**
- You'll get a response with your JWT token!

**Example Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzUxMi19ewogICJhbGciOiAiSFM1MTIiLAogICJ0eXAiOiAiSldUIgp9...",
    "username": "admin",
    "role": "ADMIN",
    "userId": 1
  }
}
```

**Copy this token** - you'll need it for all other requests!

---

### 🔑 Using Your JWT Token in Postman

Now that you have a token, here's how to use it in requests:

#### **Easiest Way: Use Authorization Tab**

For **every request you make** (except login):

1. Click the **Authorization** tab
2. In the dropdown, select **Bearer Token**
3. Paste your token in the **Token** field:
   ```
   eyJhbGciOiJIUzUxMi19ewogICJhbGciOiAiSFM1MTIiLAogICJ0eXAiOiAiSldUIgp9...
   ```
4. Click **Send** - Postman automatically adds the header!

**Visual Guide:**
```
┌──────────────────────────────────┐
│ Authorization Tab                │
├──────────────────────────────────┤
│ Type: [Bearer Token  ▼]           │
│ Token: [eyJhbGciOiJIUzUxMi...    │
│                                  │
└──────────────────────────────────┘
```

#### **Manual Way: Add to Headers**

If you prefer:

1. Click **Headers** tab
2. Add a new header row:
   - **Key**: `Authorization`
   - **Value**: `Bearer eyJhbGciOiJIUzUxMi19ewog...`

**Example:**
```
Authorization | Bearer eyJhbGciOiJIUzUxMi19ewog...
Content-Type  | application/json
```

#### **⏰ Token Validity**
- ✅ **Valid for**: 24 hours
- 🔄 **Expires**: After 24 hours of issuance
- 🔐 **What it contains**: Your user ID, username, role, expiration time
- 🚨 **Expired?** Simply login again to get a new token!

#### **🛡️ Security Tips**
- 🔒 **Never share your token** with anyone
- ⛔ **Don't commit tokens** to Git/GitHub
- 🚫 **Don't paste in public** (like forums, screenshots)
- ✓ **Use environment variables** in Postman for secrets

---

### 2️⃣ Now Test Other Endpoints with Your Token

For all other requests, just add your token and start exploring!

#### Get Dashboard Summary Example

Here's an example of testing an endpoint with your token:

**In Postman:**
- Method: **GET**
- URL: `http://localhost:8080/api/dashboard/1/summary`
- Authorization Tab: Select **Bearer Token** and paste your token
- Click **Send**

**Response:**
```json
{
  "success": true,
  "data": {
    "totalIncome": 5500.00,
    "totalExpense": 1200.00,
    "netBalance": 4300.00,
    "transactionCount": 5
  }
}
```

---

## 📚 Complete API Reference

### Authentication Endpoints

#### Login
```
POST /auth/login
Body: { "username": "admin", "password": "Admin@123" }
```

#### Register New User
```
POST /auth/register
Body: {
  "username": "newuser",
  "email": "user@example.com",
  "password": "SecurePassword@123",
  "fullName": "Full Name",
  "role": "ANALYST"
}
```

---

### Transaction Endpoints

#### Get All Transactions
```
GET /transactions/1
Headers: Authorization: Bearer <token>
```

#### Get Transactions with Filters
```
GET /transactions/1?type=EXPENSE&category=Food&startDate=2024-01-01
```

#### Create a New Transaction
```
POST /transactions
Headers: Authorization: Bearer <token>
Body: {
  "userId": 1,
  "amount": 50.00,
  "type": "EXPENSE",
  "category": "Food",
  "description": "Lunch at restaurant",
  "transactionDate": "2024-04-04"
}
```

#### Update Transaction
```
PUT /transactions/1/5
Headers: Authorization: Bearer <token>
Body: {
  "amount": 60.00,
  "type": "EXPENSE",
  "category": "Food",
  "description": "Lunch (updated)",
  "transactionDate": "2024-04-04"
}
```

#### Delete Transaction
```
DELETE /transactions/1/5
Headers: Authorization: Bearer <token>
```

---

### Dashboard Endpoints

#### Get Summary (Total Income/Expense/Balance)
```
GET /dashboard/1/summary
Headers: Authorization: Bearer <token>
```

#### Get Category Breakdown
```
GET /dashboard/1/categories
Headers: Authorization: Bearer <token>
```

Response shows spending by category with percentages:
```json
{
  "success": true,
  "data": {
    "categories": {
      "Food": {
        "total": 450.50,
        "percentage": "37.5%",
        "count": 12
      },
      "Transport": {
        "total": 300.00,
        "percentage": "25%",
        "count": 8
      }
    },
    "totalAmount": 1200.00
  }
}
```

---

### User Management (Admin Only)

#### Get All Users
```
GET /users
Headers: Authorization: Bearer <admin-token>
```

#### Get Specific User
```
GET /users/1
Headers: Authorization: Bearer <admin-token>
```

#### Update User
```
PUT /users/1
Headers: Authorization: Bearer <admin-token>
Body: {
  "email": "newemail@example.com",
  "fullName": "Updated Name"
}
```

#### Delete User
```
DELETE /users/1
Headers: Authorization: Bearer <admin-token>
```

---

## 🛠️ Tech Stack

- **Framework**: Spring Boot 3.2.0
- **Database**: MySQL (or H2 in-memory for testing)
- **Security**: JWT (JSON Web Tokens)
- **Authentication**: Spring Security
- **ORM**: Hibernate + JPA
- **Build Tool**: Maven

---

## 📁 Project Structure

```
src/main/java/com/finance/dashboard/
├── controller/        # REST endpoints
├── service/          # Business logic
├── entity/           # Database entities (User, Transaction)
├── dto/              # Data Transfer Objects
├── repository/       # Database queries
├── security/         # JWT & Authentication
├── exception/        # Custom exceptions & error handling
└── config/           # Configuration & DataSeeder

resources/
└── application.properties  # Database & JWT configuration
```

---

## 🆘 Troubleshooting

### "Cannot connect to database"
- Make sure MySQL server is running
- Check database credentials in `application.properties`

### "401 Unauthorized"
- You forgot to add the `Authorization` header
- Your token might have expired (24 hours)
- Login again to get a fresh token

### "403 Forbidden"
- Your role doesn't have permission for this action
- Login with `admin` account to test all features

---

## 💡 Pro Tips

1. **Start with the test accounts** - Use admin/Admin@123 to explore everything
2. **Use Postman** - Download [Postman](https://www.postman.com/downloads/) to test APIs easily
3. **Read error messages** - They tell you exactly what's wrong
4. **Keep your token safe** - Don't share it with anyone

---

## 📝 License

This project is open source and available under the MIT License.

Happy coding! 🎉

```json
{
  "username": "jane_doe",
  "email": "jane@example.com",
  "fullName": "Jane Doe",
  "role": "ANALYST",
  "status": "ACTIVE"
}
```

### Delete User (soft delete)

**DELETE** `/users/{userId}`

## Database

- **Development**: H2 (in-memory, automatically set up)
- **Production**: You can switch to MySQL by updating `application.properties`

### H2 Console (Dev Only)

Access database UI at: `http://localhost:8080/api/h2-console`
- JDBC URL: `jdbc:h2:mem:financedb`
- Username: `sa`
- Password: (leave empty)

## Project Structure

```
src/main/java/com/finance/dashboard/
├── controller/          # API endpoints
├── service/            # Business logic
├── entity/             # Database models
├── dto/                # Request/Response objects
├── repository/         # Database access
├── security/           # JWT & authentication
├── exception/          # Error handling
└── config/             # Spring configuration
```

## Key Features

✅ **JWT Authentication** - Secure token-based login  
✅ **Role-Based Access Control** - @PreAuthorize annotations on endpoints  
✅ **Validation** - Input validation on all requests  
✅ **Error Handling** - Clear error messages with proper HTTP codes  
✅ **Transaction Filtering** - Filter by date, category, type  
✅ **Analytics Ready** - Category totals and financial summaries  

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP codes:
- `200` - Success
- `400` - Bad request (validation error)
- `401` - Unauthorized (invalid token)
- `403` - Forbidden (no permission)
- `404` - Not found
- `500` - Server error

## JWT Token Configuration

- **Secret**: Defined in `application.properties` (change in production!)
- **Expiration**: 24 hours (86400000 ms)
- **Algorithm**: HS512

## Notes

- All dates are in `YYYY-MM-DD` format
- Amounts are in decimal format (e.g., 100.50)
- Users can only see their own transactions (enforced at service level)
- Admins can see all users' data

## Next Steps (For Production)

1. Change JWT secret in `application.properties`
2. Switch database to MySQL (uncomment MySQL config)
3. Add HTTPS/SSL
4. Add rate limiting
5. Add request logging
6. Set up CI/CD pipeline

---

**Built with**: Spring Boot 3.2 | Spring Security | JWT | JPA/Hibernate | H2 Database
Body: { "username": "john", "password": "pass123" }
Returns: { "token": "jwt_token", "username": "john", "role": "ANALYST" }
```

### Users (Admin Only)
```
POST   /users                 - Create new user
GET    /users                 - List all users
GET    /users/{id}            - Get user details
PUT    /users/{id}            - Update user
DELETE /users/{id}            - Delete user
```

### Transactions
```
POST   /transactions/{userId}                      - Create transaction
GET    /transactions/{userId}                      - List transactions
       ?type=INCOME                                - Filter by type
       ?category=FOOD                              - Filter by category  
       ?startDate=2024-01-01&endDate=2024-12-31   - Filter by date range
       
GET    /transactions/{userId}/{transactionId}     - Get single transaction
PUT    /transactions/{userId}/{transactionId}     - Update transaction
DELETE /transactions/{userId}/{transactionId}     - Delete transaction (Admin only)
```

### Dashboard (Analyst+)
```
GET /dashboard/{userId}/summary       - Total income, expenses, balance, count
GET /dashboard/{userId}/categories    - Breakdown by category
```

## Data Model

### User
- id, username, email, password, fullName
- role: VIEWER | ANALYST | ADMIN
- status: ACTIVE | DELETED
- createdAt, updatedAt

### Transaction
- id, userId, amount, type (INCOME/EXPENSE)
- category, description, transactionDate
- createdAt, updatedAt

## Example Usage

### 1. Create a User
```bash
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john",
    "email": "john@example.com",
    "password": "securepass123",
    "fullName": "John Doe",
    "role": "ANALYST"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john",
    "password": "securepass123"
  }'
```

### 3. Add a Transaction
```bash
curl -X POST http://localhost:8080/api/transactions/1 \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1500.00,
    "type": "INCOME",
    "category": "SALARY",
    "description": "Monthly salary",
    "transactionDate": "2024-01-15"
  }'
```

### 4. Get Dashboard Summary
```bash
curl -X GET http://localhost:8080/api/dashboard/1/summary \
  -H "Authorization: Bearer {token}"
```

Response:
```json
{
  "success": true,
  "message": "Summary fetched",
  "data": {
    "totalIncome": 5000.00,
    "totalExpense": 1200.00,
    "netBalance": 3800.00,
    "transactionCount": 15
  }
}
```

## Features Included

✅ User authentication with JWT tokens  
✅ Role-based access control  
✅ Full transaction CRUD  
✅ Flexible filtering (date, category, type)  
✅ Financial summaries and analytics  
✅ Input validation  
✅ Error handling with meaningful messages  
✅ MySQL support (H2 for development)  

## Testing

Create test data with different roles:

```bash
# Create admin user
POST /users with role="ADMIN"

# Create analyst user  
POST /users with role="ANALYST"

# Create viewer user
POST /users with role="VIEWER"

# Login and get token
POST /auth/login

# Test endpoints with that token
GET /transactions/{userId} (Viewer can see)
POST /transactions/{userId} (Viewer cannot - DENIED)
```

## Code Structure

```
src/main/java/com/finance/dashboard/
├── controller/          # REST endpoints
├── service/            # Business logic
├── repository/        # Database access
├── entity/           # Data models
├── dto/             # Request/response objects
├── security/        # JWT and auth
├── exception/       # Error handling
└── config/         # Spring configuration
```

## Notes

- **Database**: MySQL by default. Change in `application.properties` for H2
- **Passwords**: Encoded with BCrypt for security
- **Timestamps**: All entities track created/updated times
- **Soft Delete**: Users are marked DELETED instead of hard-deleted
- **Validation**: All inputs are validated (see DTOs for rules)

## Default Credentials

None - create your first admin user through the API.

## What Changed (Simplified Version)

- Removed unnecessary DTOs (CategoryAnalysisDTO, TrendDTO)
- Consolidated multiple filter endpoints into one with query parameters
- Removed excessive logging for cleaner output
- Simplified service methods - less duplication
- Constructor injection instead of @Autowired annotations
- Focused on essential features only
- Cleaner, more maintainable code structure

**Built with**: Spring Boot 3.2, JWT, MySQL, JPA/Hibernate
- ✅ Global exception handling
- ✅ Input validation (Bean Validation)
- ✅ Business logic beyond CRUD
- ✅ RESTful API design
- ✅ Clean code practices
- ✅ Proper logging

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss proposed changes.

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## ✉️ Contact

For questions or support, please contact the development team.

---

**Built with ❤️ using Spring Boot**
