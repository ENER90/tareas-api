# 🗂️ Tasks API

RESTful API to manage tasks and users, built with **Node.js**, **Express**, and **MongoDB**.  
Ideal for learning or integrating into a simple task management system.

---

## 📚 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Docker](#docker)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

- **Complete CRUD operations** for Tasks and People
- **RESTful architecture** with proper HTTP methods
- **Environment-based configuration** with .env support
- **Clean modular structure** organized in `src/` directory
- **MongoDB integration** with Mongoose ODM
- **Comprehensive testing suite** with Jest and Supertest (68 tests)
- **Input validation** with custom middleware
- **Error handling** with global middleware
- **Soft delete** for tasks (preserves data)
- **Hard delete** for people
- **Docker support** for easy database setup

---

## 🛠️ Tech Stack

- **Backend**: Node.js + Express.js
- **Database**: MongoDB with Mongoose ODM
- **Testing**: Jest + Supertest
- **Environment**: dotenv
- **Containerization**: Docker & Docker Compose
- **Validation**: Custom validation middleware
- **Development**: Nodemon for hot reload

---

## ✅ Prerequisites

- **Node.js** `v18+`
- **MongoDB** (local or MongoDB Atlas)
- **Docker** (optional, for easy database setup)
- **Git** for version control

---

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/ENER90/tareas-api.git
cd tareas-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.template .env
```

Edit the `.env` file with your configuration (see [Environment Variables](#environment-variables))

### 4. Start MongoDB (using Docker)

```bash
docker-compose up -d mongodb
```

### 5. Run the application

```bash
# Development mode
npm run dev

# Production mode
npm start
```

---

## 🎯 Usage

Once the server is running, you can access the API at:

- **Local**: `http://localhost:3000`
- **Health check**: The server will log "App listening on port 3000" when ready

---

## 📡 API Endpoints

### People Endpoints

| Method   | Endpoint      | Description                 | Body              |
| -------- | ------------- | --------------------------- | ----------------- |
| `GET`    | `/people`     | Get all people              | -                 |
| `GET`    | `/people/:id` | Get person by ID            | -                 |
| `POST`   | `/people`     | Create new person           | `{ name, age }`   |
| `PUT`    | `/people/:id` | Update person               | `{ name?, age? }` |
| `DELETE` | `/people/:id` | Delete person (hard delete) | -                 |

### Tasks Endpoints

| Method   | Endpoint     | Description               | Body                                                       |
| -------- | ------------ | ------------------------- | ---------------------------------------------------------- |
| `GET`    | `/tasks`     | Get all tasks             | -                                                          |
| `GET`    | `/tasks/:id` | Get task by ID            | -                                                          |
| `POST`   | `/tasks`     | Create new task           | `{ title, status, assignedTo, description?, dueDate? }`    |
| `PUT`    | `/tasks/:id` | Update task               | `{ title?, status?, assignedTo?, description?, dueDate? }` |
| `DELETE` | `/tasks/:id` | Delete task (soft delete) | -                                                          |

### Request/Response Examples

#### Create a Person

```bash
POST /people
Content-Type: application/json

{
  "name": "John Doe",
  "age": 30
}
```

#### Create a Task

```bash
POST /tasks
Content-Type: application/json

{
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "status": "To Do",
  "assignedTo": "64a7b8c9d1e2f3g4h5i6j7k8",
  "dueDate": "2024-12-31T23:59:59.000Z"
}
```

#### Task Status Values

- `"To Do"`
- `"In Progress"`
- `"In Revision"`
- `"Done"`

---

## 🧪 Testing

This project includes a comprehensive testing suite with **68 tests** covering all endpoints.

### Run Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- tests/routes/person.test.js
npm test -- tests/routes/task.test.js

# Run tests in watch mode
npm test -- --watch
```

### Test Coverage

- ✅ **Person Routes**: 25 tests (GET, POST, PUT, DELETE)
- ✅ **Task Routes**: 43 tests (POST, GET, PUT, DELETE)
- ✅ **Validation Tests**: All edge cases covered
- ✅ **Error Handling**: Database and validation errors
- ✅ **Integration Tests**: Full request/response cycle

### Test Structure

```
tests/
└── routes/
    ├── person.test.js    # Person endpoint tests
    └── task.test.js      # Task endpoint tests
```

### Make sure MongoDB is running or use a test database before running tests.

---

## 📁 Project Structure

```
tareas-api/
├── src/                      # Source code directory
│   ├── models/              # Mongoose models
│   │   ├── person.js        # Person model
│   │   └── task.js          # Task model
│   ├── routes/              # Express routes
│   │   ├── person.js        # Person routes
│   │   └── task.js          # Task routes
│   ├── validations/         # Input validation middleware
│   │   ├── person.js        # Person validation
│   │   └── task.js          # Task validation
│   └── db.js               # Database connection
├── tests/                   # Test files
│   └── routes/             # Route tests
│       ├── person.test.js  # Person tests (25 tests)
│       └── task.test.js    # Task tests (43 tests)
├── app.js                  # Express app configuration
├── package.json            # Dependencies and scripts
├── jest.config.js          # Jest configuration
├── docker-compose.yml      # Docker configuration
├── .env.template          # Environment variables template
├── .env                   # Environment variables (create from template)
└── README.md              # This file
```

---

## 🔧 Environment Variables

Create a `.env` file from `.env.template` and configure:

```env
# Server configuration
PORT=3000

# Database configuration
MONGO_DB_URL="mongodb://user:password@localhost:27017/tasksdb"

# For MongoDB Atlas (cloud):
# MONGO_DB_URL="mongodb+srv://username:password@cluster.mongodb.net/tasksdb"
```

### Required Variables

- `PORT`: Server port (default: 3000)
- `MONGO_DB_URL`: MongoDB connection string

---

## 🚀 Scripts

```json
{
  "start": "node app.js",
  "dev": "nodemon app.js",
  "test": "jest --detectOpenHandles"
}
```

- `npm start`: Run in production mode
- `npm run dev`: Run in development mode with auto-reload
- `npm test`: Run test suite

---

## 🐳 Docker

### Start MongoDB with Docker

```bash
# Start MongoDB container
docker-compose up -d mongodb

# Stop MongoDB container
docker-compose down
```

### Docker Compose Configuration

The project includes a `docker-compose.yml` with:

- MongoDB container
- Persistent data volume
- Pre-configured authentication

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code structure in `src/`
- Add tests for new features
- Ensure all tests pass before submitting (`npm test`)
- Use meaningful commit messages
- Follow the established validation patterns

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🎉 Acknowledgments

- Built with Express.js and MongoDB
- Comprehensive testing with Jest and Supertest
- Docker support for easy development
- Clean architecture following best practices
- Modular structure with separation of concerns
