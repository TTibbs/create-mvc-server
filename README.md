## Create MVC Server

Welcome to the Create MVC Server tool! This utility helps you easily scaffold a new MVC server for your project with an interactive setup.

### Available Options

You can customise your server with the following options:

- **Server Framework**: Choose between Express or Hono (PostgreSQL only).
- **Database**: Select from PostgreSQL, MongoDB, MySQL, or SQLite.
- **Language**: Pick either JavaScript or TypeScript.

### How to Use

You can create your project in two ways:

#### 1. Interactive Mode

The interactive mode guides you through a series of prompts to configure your project:

```bash
npx create-mvc-server my-project
```

The process includes:

1. **Project Name**: Enter your project name (defaults to "mvc-server" if not specified).
2. **Configuration Mode**: Choose between individual component selection or a pre-defined template.
3. **Component Selection** (if choosing individual components):
   - Select your server framework (Express or Hono).
   - Choose your database (PostgreSQL, MongoDB, MySQL, or SQLite).
   - Pick your language (JavaScript or TypeScript).
4. **Template Selection** (if choosing template mode):
   - Select from available templates that match your framework, database, and language choices.
5. **Directory Handling**: Decide what to do if the target directory exists (overwrite, merge, or cancel).
6. **Package Name Validation**: Verify or modify the package name for npm compatibility.
7. **Configuration Summary**: Review your selections before proceeding.
8. **Project Creation**: Files are copied and customised based on your selections.

#### 2. Template Mode

If you already know which template you want to use, you can skip the interactive prompts by specifying a template directly:

```bash
npx create-mvc-server my-project --template <template-name>
```

This mode is perfect for:

- Quickly creating projects with the same configuration.
- Using the tool in scripts or CI/CD pipelines.

#### Command Line Options

```bash
Usage: create-mvc-server [options] [project-name]

Options:
  -t, --template NAME        Specify a template to use.
  -h, --help                 Display this help message.
```

### Available Templates

The CLI dynamically discovers templates from the filesystem. Here are some standard templates you can use:

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

- Interactive CLI prompts for easy project configuration.
- Dynamic template discovery from the filesystem.
- Option to initialise a Git repository.
- Automatic package name validation.
- Smart template selection based on your choices.
- Support for multiple package managers (npm, yarn).
- Directory conflict resolution.
- Automatic file renaming (e.g., \_gitignore → .gitignore).

### Project Structure

The generated project will include:

- Basic server setup with your chosen framework.
- Database configuration.
- Type definitions (for TypeScript projects).
- Basic routing structure.
- Error handling middleware.
- Environment configuration.
- Testing setup.

### Example Usage

```bash
# Create a new project with interactive prompts
npx create-mvc-server my-server

# Create a new project using a specific template
npx create-mvc-server my-server --template pg-ts
```

After creating your project, follow the printed instructions to:

1. Navigate to the project directory.
2. Install dependencies.
3. Start the development server.

### Database Setup

Depending on your chosen database, you'll need to set it up accordingly:

#### PostgreSQL

- Install PostgreSQL locally or use a cloud service (e.g., AWS RDS, DigitalOcean).
- Set up connection details in your `.env` file:
  ```
  DATABASE_URL=postgresql://user:password@localhost:5432/dbname
  ```

#### MongoDB

- Install MongoDB locally or use MongoDB Atlas.
- Set up connection details in your `.env` file:
  ```
  MONGODB_URI=mongodb://localhost:27017/dbname
  ```

#### MySQL

- Install MySQL locally or use a cloud service.
- Set up connection details in your `.env` file:
  ```
  DATABASE_URL=mysql://user:password@localhost:3306/dbname
  ```

#### SQLite

- No additional installation required.
- Set up the database path in your `.env` file:
  ```
  DATABASE_URL=file:./dev.db
  ```

### Deployment

You can deploy the generated server to various platforms, including:

- **Supabase**: Supports PostgreSQL, MongoDB, MySQL, and SQLite.
- **Heroku**: Compatible with all database options.
- **Vercel**: Works well with Serverless deployment (especially Hono).
- **DigitalOcean**: Supports all database options.
- **AWS**: Can be deployed to EC2, ECS, or Lambda.
- **Railway**: Excellent for both application and database hosting.

Remember to:

1. Set up appropriate environment variables.
2. Configure your database connection string.
3. Implement proper security measures (e.g., SSL, firewalls).

## How It Works

The Create MVC Server tool uses a dynamic template discovery system to find and manage available templates:

1. The CLI scans for directories with the naming pattern `template-{id}`.
2. Template requirements are automatically inferred from the ID based on naming conventions.
3. Available options (frameworks, databases, languages) are mapped to parts of the template ID.
4. The CLI provides a fallback to default templates if none are discovered.

### Template Discovery Process

- Template directories must follow the naming pattern: `template-[server]-[database]-[language]`.
- Some parts can be omitted, and defaults will be used:
  - If the server is omitted: Express is assumed.
  - If the language is omitted: JavaScript is assumed.
  - The database must always be specified.

### Technology Mappings

The CLI recognises these technology identifiers in template names:

- **Servers**: `express`, `hono`
- **Databases**: `pg` (PostgreSQL), `mongo` (MongoDB), `mysql` (MySQL), `sqlite` (SQLite)
- **Languages**: `ts` (TypeScript) - omit for JavaScript

## Contributing

We welcome contributions to improve Create MVC Server! Here's how you can help:

### Standard Contribution Process

1. **Fork the Repository**: Visit the GitHub repository and click the "Fork" button to create a copy in your GitHub account.
2. **Clone Your Fork**:
   ```bash
   git clone https://github.com/your-username/create-mvc-server.git
   cd create-mvc-server
   ```
3. **Install Dependencies**:
   ```bash
   npm install
   ```
4. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
5. **Make Your Changes**: Implement your features or bug fixes while following the project's code style and conventions.
6. **Build and Test**:
   ```bash
   npm run build
   # Test your changes thoroughly
   ```
7. **Commit Your Changes**:
   ```bash
   git commit -m "Add feature: your feature description"
   ```
8. **Push to Your Fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
9. **Create a Pull Request**: Go to the original repository, click "New Pull Request," select "compare across forks," and describe your changes in detail.
10. **Wait for Review**: Maintainers will review your PR. Address any requested changes, and once approved, your PR will be merged.

### Adding New Templates

You can contribute by creating new templates. Here's how:

1. Create a new directory in the project using the naming convention: `template-[server]-[database]-[language]`.
2. Structure your template following existing templates as a guide.
3. Ensure your template includes:
   - A complete server setup with the specified framework.
   - Database configuration for the specified database.
   - Standard MVC architecture (models, views, controllers).
   - A `package.json` file with appropriate dependencies.
   - Any special files like `_gitignore` (which will be renamed to `.gitignore`).

### Template Creation Guidelines

For the best compatibility:

1. Use consistent folder structures across templates.
2. Include clear documentation within the template.
3. Add appropriate TypeScript types (for TypeScript templates).
4. Include basic security measures (e.g., helmet for Express).
5. Add sensible defaults for configuration.
6. Ensure all environment variables are properly documented.
7. Include example routes and controllers.

### Testing New Templates

After creating a new template:

1. Build the project with `npm run build`.
2. Test your template with:
   ```bash
   node packages/create-mvc/index.js my-test-project --template your-template-id
   ```
3. Validate that the generated project works as expected.

### Reporting Issues

If you find a bug or have a feature request:

1. Check if the issue already exists in the GitHub issues.
2. If not, create a new issue with a descriptive title.
3. Include detailed steps to reproduce the bug or a clear description of the feature.
4. Provide relevant information like your operating system, Node.js version, etc.

We appreciate your contributions to making Create MVC Server better!
