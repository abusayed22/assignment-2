# Assignment-2(vehicle-rent-system)
> **Live URL:** [https://assignment-2-rent-system.vercel.app/]((https://assignment-2-rent-system.vercel.app/))


two user already registrated
customer: {
    "name":"imun",
    "email":"imun@gmail.com",
    "password":"12345",
    "phone":"12345678901",
    "role":"customer"
}

admin:  {
    "name":"John Doe Updated",
    "email":"john.updated@example.com",
    "password":"12345",
    "phone":"+1234567899",
    "role":"admin"
}



## Features & Technology Stack.
### vehicle rent system:
  Vehicle Management
CRUD Operations: Admins can Add, Update, and Delete vehicles.

Smart Availability: Vehicles are automatically marked as booked when a reservation is made and available when returned.

Public Browsing: Anyone can view the list of available cars with details like pricing and type.

  Booking System
Transactional Integrity: Uses SQL Transactions (BEGIN, COMMIT, ROLLBACK) to ensure data consistency. If a booking fails, the vehicle status remains unchanged.

Automated Price Calculation: Total cost is calculated server-side based on rental duration and daily rates.

Conflict Prevention: Prevents double-booking by locking database rows (FOR UPDATE) during the booking process.

Status Workflow: Handles active, cancelled, and returned statuses, automatically freeing up vehicles upon return.

  Security & Validation
Input Validation: Strict data validation using Zod to prevent bad data entry.

SQL Injection Protection: Uses parameterized queries ($1, $2) throughout the application.

Secure Headers: Implemented to protect against common web vulnerabilities.

### Technology Stack:
Node.js, Express.js, Typescript and db postgress
JSON Web Token (JWT): For secure transmission of information between parties.

Bcrypt.js: For secure password hashing.



## Getting Started

Follow these steps to run the project locally.

### Prerequisites
* Node.js (v18+)
* PostgreSQL installed and running locally.

### 1. Clone the Repository
```bash
git clone [https://github.com/abusayed22/assignment-2.git]((https://github.com/abusayed22/assignment-2.git))
cd assignment-2
npm install


