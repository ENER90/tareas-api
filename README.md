# Tasks API

This project is an API for managing tasks and users. It is developed with Node.js, Express, and MongoDB.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- Docker (optional)

## Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/your-username/tasks-api.git
   cd tasks-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your environment variables:
   ```
   PORT=3000
   MONGO_DB_URL=your_mongodb_connection_string
   ```

## Usage

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Run tests:
   ```bash
   npm test
   ```

## API Endpoints

### People

- GET /people - Get all people
- GET /people/:id - Get a specific person
- POST /people - Create a new person
- PUT /people/:id - Update a person
- DELETE /people/:id - Delete a person

### Tasks

- GET /tasks - Get all tasks
- GET /tasks/:id - Get a specific task
- POST /tasks - Create a new task
- PUT /tasks/:id - Update a task
- DELETE /tasks/:id - Delete a task

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
