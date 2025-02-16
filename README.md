## Create MVC Server

The core logic is implemented in `packages/create-mvc/src/index.ts` and provides an interactive way to scaffold a new MVC server for your project.

### Available Options

The tool supports the following configuration options:

- **Server Framework**

  - Express
  - Hono (PostgreSQL only)

- **Database**

  - PostgreSQL
  - MongoDB
  - MySQL
  - SQLite

- **Language**
  - JavaScript
  - TypeScript

### Usage

You can use the tool in two ways:

1. **Interactive Mode**

```bash
npx create-mvc
```

2. **Template Mode**

```bash
npx create-mvc --template <template-name>
```

#### Command Line Options

```bash
Usage: create-mvc [options] [project-name]

Options:
  -t, --template NAME        Use a specific template
  -h, --help                Display this help message
```

### Available Templates

The following templates are available:

- `pg-ts`: Express + PostgreSQL + TypeScript
- `pg`: Express + PostgreSQL + JavaScript
- `mongo-ts`: Express + MongoDB + TypeScript
- `mongo`: Express + MongoDB + JavaScript
- `mysql-ts`: Express + MySQL + TypeScript
- `mysql`: Express + MySQL + JavaScript
- `sqlite-ts`: Express + SQLite + TypeScript
- `sqlite`: Express + SQLite + JavaScript
- `hono-pg-ts`: Hono + PostgreSQL + TypeScript
- `hono-pg`: Hono + PostgreSQL + JavaScript

### Features

- Interactive CLI prompts for project configuration
- Git repository initialization option
- Automatic package name validation
- Smart template selection based on chosen options
- Support for multiple package managers (npm, yarn)
- Directory conflict resolution
- Automatic file renaming (e.g., \_gitignore → .gitignore)

### Project Structure

The generated project will include:

- Basic server setup with chosen framework
- Database configuration
- Type definitions (for TypeScript projects)
- Basic routing structure
- Error handling middleware
- Environment configuration
- Testing setup

### Example

```bash
# Create a new project with interactive prompts
npx create-mvc my-server

# Create a new project using a specific template
npx create-mvc my-server --template pg-ts
```

After project creation, follow the printed instructions to:

1. Navigate to the project directory
2. Install dependencies
3. Start the development server

### Database Setup

Depending on your chosen database, you'll need to:

#### PostgreSQL

- Install PostgreSQL locally or use a cloud service (e.g., AWS RDS, DigitalOcean)
- Set up connection details in your `.env` file:
  ```
  DATABASE_URL=postgresql://user:password@localhost:5432/dbname
  ```

#### MongoDB

- Install MongoDB locally or use MongoDB Atlas
- Set up connection details in your `.env` file:
  ```
  MONGODB_URI=mongodb://localhost:27017/dbname
  ```

#### MySQL

- Install MySQL locally or use a cloud service
- Set up connection details in your `.env` file:
  ```
  DATABASE_URL=mysql://user:password@localhost:3306/dbname
  ```

#### SQLite

- No additional installation required
- Set up database path in your `.env` file:
  ```
  DATABASE_URL=file:./dev.db
  ```

### Deployment

The generated server can be deployed to various platforms:

- **Supabase**: Supports PostgreSQL, MongoDB, MySQL, and SQLite
- **Heroku**: Supports all database options
- **Vercel**: Works well with Serverless deployment (especially Hono)
- **DigitalOcean**: Supports all database options
- **AWS**: Can be deployed to EC2, ECS, or Lambda
- **Railway**: Excellent for both application and database hosting

Remember to:

1. Set up appropriate environment variables
2. Configure your database connection string
3. Set up proper security measures (e.g., SSL, firewalls)
