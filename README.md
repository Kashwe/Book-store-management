# BookStore Management System

A full-stack BookStore Management System built with **Spring Boot 3.x (Java 17)** and **React (Vite + Material-UI)** utilizing **MongoDB** for database persistence and **JWT** for stateless role-based authentication.

---

## Project Structure

```
BookStoreManagement/
├── backend/                  # Spring Boot 3.x backend
│   ├── pom.xml               # Maven configuration
│   └── src/
│       └── main/
│           ├── java/com/bookstore/   # Java backend sources
│           └── resources/            # Spring properties
└── frontend/                 # React (Vite) frontend
    ├── package.json          # Node dependencies
    ├── vite.config.js        # Vite configurations
    └── src/                  # React source files
```

---

## Prerequisites

To run this application, make sure you have the following installed:
- **Java JDK 17** (or higher)
- **Node.js** (v18.x or higher) & **npm** (v9.x or higher)
- **MongoDB** (running locally on `mongodb://localhost:27017/` or configured via connection string)

---

## Setup Instructions

### 1. Database Setup

1. Make sure your local MongoDB service is running:
   - **Windows**: Run `net start MongoDB` or check Services manager.
   - **macOS / Linux**: Run `brew services start mongodb-community` or `sudo systemctl start mongod`.
2. The backend is configured to connect to `mongodb://localhost:27017/bookstore_db` by default. It will automatically create the database and collection schemas on start.

### 2. Backend Setup

1. Open your terminal and navigate to the `backend` folder:
   ```bash
   cd BookStoreManagement/backend
   ```
2. (Optional) Adjust your MongoDB connection string in `src/main/resources/application.properties` if needed:
   ```properties
   spring.data.mongodb.uri=mongodb://localhost:27017/bookstore_db
   ```
3. Run the Spring Boot application using Maven:
   ```bash
   mvn spring-boot:run
   ```
   *(If `mvn` is not globally installed, you can build/run through your IDE or execute using the wrapper `./mvnw spring-boot:run`)*
4. **Programmatic Database Seeding**:
   Upon initial startup, the backend checks if an Administrator user exists. If not, it programmatically seeds one default Admin user:
   - **Email**: `admin@bookstore.com`
   - **Password**: `admin123` *(Hashed in DB using BCrypt)*

### 3. Frontend Setup

1. Open a new terminal window and navigate to the `frontend` folder:
   ```bash
   cd BookStoreManagement/frontend
   ```
2. Install the node packages:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
4. Access the frontend app in your browser at:
   - [http://localhost:5173](http://localhost:5173)

---

## Authentication & Authorization

- **JWT Authentication**: Login via `POST /api/auth/login` yields a Bearer JWT Token.
- The React application caches the JWT token in `localStorage`.
- All requests sent by Axios automatically include the `Authorization: Bearer <Token>` header using a request interceptor (`api.js`).
- If an API returns a `401 Unauthorized` status (e.g. token expired), the Axios response interceptor intercepts the error, clears local cache, and redirects the user to the Login page.

---

## API Endpoints

### Authentication (Public)
* `POST /api/auth/register` - Register a Customer account. Requires name, email (unique), password (min 6 characters), phone, and address.
* `POST /api/auth/login` - Login. Returns JWT.

### User Profiles (Authenticated)
* `GET /api/users/profile` - Retrieve the logged-in user profile metadata.
* `PUT /api/users/profile` - Update profile fields (Name, Phone, Address). Email cannot be modified.

### Books (Admin Only)
* `POST /api/books` - Add a new book to the database. Validates Price > 0, Quantity >= 0.
* `PUT /api/books/{id}` - Modify existing book parameters. Returns the updated object.
