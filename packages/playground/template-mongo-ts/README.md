# MongoDB Express TypeScript Template

This is a template for building REST APIs using Express.js with TypeScript and MongoDB as the database. It follows the MVC (Model-View-Controller) pattern and includes authentication.

## Features

- TypeScript for type safety
- Express.js for the web server
- MongoDB with Mongoose for the database
- JWT Authentication
- MVC architecture
- RESTful API design
- Built-in user roles (admin and regular users)
- Pagination for lists
- Error handling middleware
- Data seeding utilities
- Environment configuration with dotenv

## Project Structure

```
template-mongo-ts/
├── config/             # Configuration files
│   └── db.ts           # Database connection
├── controllers/        # Route controllers
│   ├── userController.ts
│   └── articleController.ts
├── data/               # Seed data
│   ├── users.ts
│   └── articles.ts
├── middleware/         # Custom middleware
│   ├── authMiddleware.ts
│   └── errorMiddleware.ts
├── models/             # Mongoose models
│   ├── User.ts
│   └── Article.ts
├── routes/             # API routes
│   ├── userRoutes.ts
│   └── articleRoutes.ts
├── utils/              # Utility functions
│   └── seeder.ts       # Database seeding utility
├── app.ts              # Express application setup
├── server.ts           # Server entry point
├── .env                # Environment variables
├── package.json        # Dependencies and scripts
└── tsconfig.json       # TypeScript configuration
```

## Getting Started

1. **Install dependencies**

```bash
npm install
```

2. **Set up environment variables**

Create a `.env` file in the root directory with the following variables:

```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/my_project
JWT_SECRET=your_jwt_secret
```

3. **Seed the database (optional)**

```bash
# Import data
npm run data:import

# Destroy data
npm run data:destroy
```

4. **Run the development server**

```bash
npm run dev
```

The server will start on the port specified in your `.env` file (default: 5000).

5. **Build for production**

```bash
npm run build
```

6. **Run in production**

```bash
npm start
```

## API Endpoints

### Auth

- `POST /api/users/login` - Login and get token
- `POST /api/users/register` - Register a new user

### Users

- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin only)

### Articles

- `GET /api/articles` - Get all articles (supports pagination, filtering by tag and status)
- `GET /api/articles/:id` - Get article by ID
- `POST /api/articles` - Create a new article (requires authentication)
- `PUT /api/articles/:id` - Update an article (requires authentication, only author or admin can update)
- `DELETE /api/articles/:id` - Delete an article (requires authentication, only author or admin can delete)
- `POST /api/articles/:id/like` - Like an article (requires authentication)

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. To access protected routes, include the JWT token in the Authorization header:

```
Authorization: Bearer <your_token>
```

## Error Handling

The API includes centralized error handling middleware that processes all errors and returns consistent error responses.

## Database Models

### User

- username (String, required, unique)
- email (String, required, unique)
- password (String, required, hashed)
- name (String, required)
- bio (String, optional)
- avatar (String, optional)
- role (String, enum: ['user', 'admin'], default: 'user')
- timestamps (createdAt, updatedAt)

### Article

- title (String, required)
- slug (String, required, unique)
- content (String, required)
- summary (String, required)
- author (Reference to User model)
- tags (Array of strings)
- status (String, enum: ['draft', 'published', 'archived'], default: 'draft')
- readTime (Number, calculated based on content length)
- likes (Number, default: 0)
- timestamps (createdAt, updatedAt)

## License

MIT
