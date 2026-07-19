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
- - Access to the configured **MongoDB** database (e.g., MongoDB Atlas or a shared MongoDB instance)

---

## Setup Instructions

### 1. Database Setup

1. Ensure you have access to the MongoDB database configured for this project (e.g., MongoDB Atlas or a shared MongoDB instance).
2. Open the backend configuration file:
   ```
   backend/src/main/resources/application.properties
   ```
3. Configure the MongoDB connection string:
   ```properties
   spring.data.mongodb.uri=<your-mongodb-connection-string>
   ```
4. Replace `<your-mongodb-connection-string>` with the connection string provided for your project. The application will automatically create the required database and collections on startup if they do not already exist.

### 2. Backend Setup

1. Open your terminal and navigate to the `backend` folder:
   ```bash
   cd BookStoreManagement/backend
   ```
2. Verify that the MongoDB connection string in `src/main/resources/application.properties` is correctly configured.
3. Run the Spring Boot application using Maven:
   ```bash
   mvn spring-boot:run
   ```
   *(If `mvn` is not globally installed, you can build/run through your IDE or execute using the wrapper `./mvnw spring-boot:run`)*
4. **Programmatic Database Seeding**:
   Upon initial startup, the backend checks if an Administrator user exists. If not, it automatically creates a default Admin user:
   - **Email**: `admin@bookstore.com`
   - **Password**: `admin123` *(Stored securely using BCrypt hashing)*

### 3. Frontend Setup

1. Open a new terminal window and navigate to the `frontend` folder:
   ```bash
   cd BookStoreManagement/frontend
   ```
2. Install the required Node.js dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
4. Access the frontend application in your browser at:
   - **http://localhost:5173**

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

### Orders (Authenticated)
* `GET /api/orders/my-orders` - Retrieve the logged-in customer's order history.
* `PUT /api/orders/{orderId}/cancel` - Cancel a pending order.

### Reviews (Authenticated)
* `POST /api/reviews` - Submit a review for a book.
* `GET /api/reviews/{bookId}` - Retrieve all reviews for a specific book.

### Ratings (Authenticated)
* `POST /api/ratings` - Submit or update a rating for a book.

### Reports (Admin Only)
* `GET /api/reports/inventory` - Generate the current book inventory report.
* `GET /api/reports/orders` - Generate order statistics report.
