# quick-ex-db

A CLI tool to quickly scaffold an Express.js app with different database options.

## Installation

To install this package globally, run:

```bash
npm install -g quick-ex-db
```

## Usage

After installation, you can create a new Express app by running:

```bash
npx quick-ex-db <project-name>
```

## PostgreSQL

<details>
  <summary>Click here to view PostgreSQL setup</summary>

## Configure ENV files for development and testing:

- `.env.test`

```bash
PGDATABASE=your_test_db_name
```

- `.env.development`

```bash
PGDATABASE=your_db_name
```

## Write Your First Test

Create the first endpoint test in app.test.js:

```javascript
const request = require("supertest");
const app = require("../app");

describe("GET /endpoint", () => {
  it("should respond with 200 status", async () => {
    const response = await request(app).get("/endpoint");
    expect(response.statusCode).toBe(200);
  });
});
```

Run the test:

```bash
npm test
```

## Creating Routes, Controllers, and Models

- Routes: Define your endpoints in the routes folder, for example:

```javascript
const express = require("express");
const router = express.Router();
const { getExample } = require("../controllers/example-controller.js");

router.get("/example", getExample);

module.exports = router;
```

- Controllers: Write the logic needed for the endpoint in the controllers folder, for example:

```javascript
const { selectExample } = require("../models/example-model.js");

exports.getExample = (req, res, next) => {
  selectExample()
    .then((example) => {
      res.status(200).send({ example });
    })
    .catch((err) => {
      next(err);
    });
};
```

- Models: Now, add the logic needed for the controller to work in the models folder, for example:

```javascript
const db = require("../../db/connection.js");

exports.selectExample = () => {
  return db.query("SELECT * FROM example_table").then(({ rows }) => {
    return rows;
  });
};
```

## Setting up your database

1. Ensure PostgreSQL is installed and setup on your system.
2. Create a new database:

```bash
createdb <database-name>
```

</details>

## MySQL

<details>
  <summary>Click here to view MySQL setup</summary>

## Configure ENV files for development and testing:

- `.env.development`

```bash
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
```

## Setting up your database

1. Ensure MySQL is installed and setup on your system.
2. Create a new database:

```bash
mysql -u your_db_user -p
CREATE DATABASE your_db_name;
```

## Running the server

After configuring your .env file and setting up the database, you can start the server:

```bash
npm start
```

## Creating Routes, Controllers, and Models

- Route: Define your endpoints in the routes folder, for example:

```JavaScript
const express = require("express");
const router = express.Router();
const { getUsers, createUser } = require("../controllers/userController");

router.get("/users", getUsers);
router.post("/users", createUser);

module.exports = router;
```

- Controllers: Write the logic needed for the endpoint in the controllers folder, for example:

```JavaScript
const db = require("../config/db");

exports.getUsers = (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) {
      res.status(500).json({ message: "Error fetching users" });
    } else {
      res.status(200).json(results);
    }
  });
};

exports.createUser = (req, res) => {
  const { name, email } = req.body;
  db.query(
    "INSERT INTO users (name, email) VALUES (?, ?)",
    [name, email],
    (err, results) => {
      if (err) {
        res.status(500).json({ message: "Error creating user" });
      } else {
        res.status(201).json({ id: results.insertId, name, email });
      }
    }
  );
};
```

- Models: Now, add the logic needed for the controller to work in the models folder, for example:

```JavaScript
const db = require("../config/db");

db.query(
  `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE
  )`,
  (err) => {
    if (err) {
      console.error("Error creating users table:", err.message);
    } else {
      console.log("Users table ready");
    }
  }
);
```

</details>

## MongoDB

<details>
  <summary>Click here to view MongoDB setup</summary>

## Configure ENV files for development and testing

- `.env.development`

```bash
MONGO_URI=your_mongodb_uri
```

## Setting up your database

1. Ensure MongoDB is installed and setup on your system.
2. Create a new database and get the connection URI.

## Running the server

After configuring your .env file and setting up the database, you can start the server:

```bash
npm start
```

## Creating Routes, Controllers, and Models

- Route: Define your endpoints in the routes folder, for example:

```JavaScript
const express = require("express");
const router = express.Router();
const { getUsers, createUser } = require("../controllers/userController");

router.get("/users", getUsers);
router.post("/users", createUser);

module.exports = router;
```

- Controllers: Write the logic needed for the endpoint in the controllers folder, for example:

```JavaScript
const User = require("../models/userModel");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createUser = async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required" });
  }

  try {
    const user = await User.create({ name, email });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

- Models: Now, add the logic needed for the controller to work in the models folder, for example:

```JavaScript
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
```

</details>

## SQLite

<details>
  <summary>Click here to view SQLite setup</summary>

## Configure ENV files for development and testing:

- .env.development

```bash
DATABASE_URL=sqlite:./database.db
```

## Setting up your database

1. Ensure SQLite is installed and setup on your system.
2. Create a new database file if it doesn't exist.

## Running the server

After configuring your .env file and setting up the database, you can start the server:

```bash
npm start
```

## Creating Routes, Controllers, and Models

- Route: Define your endpoints in the routes folder, for example:

```JavaScript
const express = require("express");
const router = express.Router();
const { getUsers, createUser } = require("../controllers/userController");

router.get("/users", getUsers);
router.post("/users", createUser);

module.exports = router;
```

- Controllers: Write the logic needed for the endpoint in the controllers folder, for example:

```JavaScript
const db = require("../config/db");

exports.getUsers = (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
      res.status(500).json({ message: "Error fetching users" });
      return;
    }
    res.status(200).json(rows);
  });
};

exports.createUser = (req, res) => {
  const { name, email } = req.body;
  db.run(
    "INSERT INTO users (name, email) VALUES (?, ?)",
    [name, email],
    function (err) {
      if (err) {
        res.status(500).json({ message: "Error creating user" });
        return;
      }
      res.status(201).json({ id: this.lastID, name, email });
    }
  );
};
```

- Models: Now, add the logic needed for the controller to work in the models folder, for example:

```JavaScript
const db = require("../config/db");

// Create table if not exists
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
  )`);
});
```

</details>

## Hosting Your API

<details>
  <summary>Click here to view API hosting steps</summary>

## Creating a Supabase Account

1. Create a Supabase account (either by email or connecting to GitHub), after signing in create a new project from your dashboard, if prompted to create a new organisation, give it a name of your liking but make sure you choose a personal organisation and select the free pricing option (unless you want to upgrade).
2. Give your project a name and create a password (using alphanumeric characters only, e.g. a-z, 0-9) for your database, save this somewhere safe for the next steps as it can't be retrieved again, but it can be reset.
3. Select any region you like, though, the closer to you the better.
4. Create your project. If you need to change any settings you can navigate to your project settings in the project dashboard.
5. Return home using the navigation menu and wait a moment for your project to finish initialising.
6. Click connect and `copy the URI connection string` - "postgres://...", or `keep that tab open as you complete the next step`.

## Setting Up Production ENV File

Carrying on from before, with the database password and URI both handy:

1. In the connection URI string, replace [YOUR-PASSWORD] with your alphanumeric database password you created earlier, removing the square brackets also.
2. Add this URI to env.production to the DATABASE_URL variable

```bash
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@<host>:<port>/postgres
```

## Hosting your API on Render

- Sign up to Render, once signed in create a new Web Service using the `New +` button at the top right.
- Either allow Render to access your GitHub repositories or paste in the URL for it, making sure it's set as public.
- Give the app a name, leaving most of the settings as default.
- Change the default build command to `yarn` and the default start command to `yarn start`.
- Scroll to near the bottom, where you can find the `Environment Variables` section:

1. Create a `Key` called `DATABASE_URL` using the URI for `Value` from your `.env.production` file
2. Create another `Key` called `NODE_ENV`, set the `value` to `production`

- Create the service and then wait a few moments while it completes, you can view the `Logs` for it by going to the `Events` on the dashboard

## Check your API

When it's deployed, you can view it via the generated link, upon navigating there you will be greeted with an error, make sure you are pointing to an existing endpoint, such as `/api` and confirm your data is being fetched correctly.

- Downloading a JSON formatter can be useful for viewing the data, you can use the [JSON Formatter from the Chrome store](https://chrome.google.com/webstore/detail/json-formatter/bcjindcccaagfpapjjmafapmmgkkhgoa?hl=en)

</details>

## Contribution

I welcome contributions to improve this tool! Here’s how you can help:

### Reporting Issues

If you find a bug or have a feature request, please create an issue on the GitHub repository.

### Making Changes

1. Fork this repository.
2. Clone your forked repository:

```bash
git clone https://github.com/<your-username>/quick-ex-db.git
```

3. Create a new branch for your feature or bugfix:

```bash
git checkout -b my-new-feature
```

4. Make your changes and commit them:

```bash
git add .
git commit -m "Add my new feature"
```

5. Push your branch to your forked repository:

```bash
git push origin my-new-feature
```

### Submitting Pull Requests

1. Go to the original repository and click "New Pull Request."
2. Describe your changes clearly and submit your PR.

## Disclaimer

I do not claim ownership of any third-party works included in this project. All third-party content is used under fair use or with permission from the original authors. If there are any issues with the use of third-party content, please contact me, and I will address them promptly.
