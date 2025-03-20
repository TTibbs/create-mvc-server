# SQLite Express TypeScript Template

This is a template for building REST APIs using Express.js with TypeScript and SQLite as the database. It follows the MVC (Model-View-Controller) pattern.

## Features

- TypeScript for type safety
- Express.js for the web server
- SQLite for a simple, file-based database
- MVC architecture
- RESTful API design
- Promise-based database operations
- Automatic database initialization and seeding
- Environment configuration with dotenv

## Project Structure

```
template-sqlite-ts/
├── config/             # Configuration files
│   └── db.ts           # Database connection and initialization
├── controllers/        # Route controllers
│   ├── userController.ts
│   └── postController.ts
├── models/             # Database models
│   ├── userModel.ts
│   └── postModel.ts
├── routes/             # API routes
│   ├── userRoutes.ts
│   └── postRoutes.ts
├── app.ts              # Express application setup
├── server.ts           # Server entry point
├── database.db         # SQLite database file (created automatically)
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

Copy `.env.example` to `.env` and modify as needed.

```bash
cp .env.example .env
```

3. **Run the development server**

```bash
npm run dev
```

The server will start on the port specified in your `.env` file (default: 5000).

4. **Build for production**

```bash
npm run build
```

5. **Run in production**

```bash
npm start
```

## API Endpoints

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/:id/posts` - Get user with their posts
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user

### Posts

- `GET /api/posts` - Get all posts
- `GET /api/posts/with-users` - Get all posts with user information
- `GET /api/posts/:id` - Get post by ID
- `GET /api/posts/user/:userId` - Get posts by user ID
- `POST /api/posts` - Create a new post
- `PUT /api/posts/:id` - Update a post
- `DELETE /api/posts/:id` - Delete a post

## Database

The application uses SQLite as the database, which is a serverless, self-contained database engine. The database file is automatically created when the application starts for the first time. The schema is defined in the `config/db.ts` file.

## License

ISC
