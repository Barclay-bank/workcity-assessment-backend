# ProjectFlow Backend API

![Node.js](https://img.shields.io/badge/Node.js-v18+-green)
![Express](https://img.shields.io/badge/Express-v4.x-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-5.0+-green)

Backend API for ProjectFlow, a project management application with client and project tracking capabilities.

## Features

- RESTful API endpoints
- JWT Authentication
- Client management
- Project tracking
- User profiles
- MongoDB database integration

## Prerequisites

- Node.js v18+
- MongoDB v5.0+
- npm v9+

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Barclay-bank/workcity-assessment-backend.git
   cd workcity-assessment-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/projectflow
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=30d
   ```

## Running the Application

Start the development server:
```bash
npm run dev
```

For production:
```bash
npm start
```

## API Documentation

### Base URL
`http://localhost:5000/api`

### Authentication
| Endpoint       | Method | Description           |
|----------------|--------|-----------------------|
| `/auth/signup` | POST   | Register new user     |
| `/auth/login`    | POST   | Login user            |
| `/auth/me`       | GET    | Get current user info |

### Clients
| Endpoint       | Method | Description            |
|----------------|--------|------------------------|
| `/clients`      | GET    | Get all clients        |
| `/clients`      | POST   | Create new client      |
| `/clients/:id`  | GET    | Get single client      |
| `/clients/:id`  | PUT    | Update client          |
| `/clients/:id`  | DELETE | Delete client          |

### Projects
| Endpoint         | Method | Description             |
|------------------|--------|-------------------------|
| `/projects`       | GET    | Get all projects        |
| `/projects`       | POST   | Create new project      |
| `/projects/:id`   | GET    | Get single project      |
| `/projects/:id`   | PUT    | Update project          |
| `/projects/:id`   | DELETE | Delete project          |

## Database Schema

### User Model
```javascript
{
  name: String,
  email: String,
  password: String,
  role: String,
  clientId: String,
  createdAt: Date
}
```

### Client Model
```javascript
{
  name: String,
  email: String,
  phone: String,
  company: String,
  website: String,
  projects: [ObjectId],
  createdAt: Date
}
```

## Environment Variables

See `.env.example` for all required environment variables.

## Testing

Run tests with:
```bash
npm test
```

## Deployment

1. Set up production environment variables
2. Build the application:
   ```bash
   npm run build
   ```
3. Start the production server:
   ```bash
   npm start
   ```

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Your Name - godstimeamerica99@gmail.com

Project Link: [https://github.com/Barclay-bank/workcity-assessment-backend.git](https://github.com/Barclay-bank/workcity-assessment-backend.git)