#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import minimist from "minimist";
import prompts from "prompts";
import colors from "picocolors";
import { execSync } from "child_process";

const {
  red,
  green,
  greenBright,
  blue,
  blueBright,
  cyan,
  yellow,
  magenta,
  reset,
} = colors;

// Type definitions
type ColorFunc = (str: string | number) => string;

type Option = {
  id: string;
  display: string;
  choices: { name: string; color: ColorFunc }[];
};

type Template = {
  id: string;
  requirements: Record<string, string>;
  color: ColorFunc;
};

type ValidationResult = {
  isValid: boolean;
  errors: string[];
};

type CommonFiles = {
  gitignore: string;
  readme: string;
  app: Map<string, string>;
  packageJson: PackageJsonTemplate;
};

type PackageJsonTemplate = {
  base: Record<string, any>;
  dependencies: Record<string, Record<string, string>>;
  devDependencies: Record<string, Record<string, string>>;
};

class TemplateBuilder {
  private commonFiles: CommonFiles;
  private database: string;
  private language: string;
  private server: string;

  constructor(selections: Record<string, string>) {
    this.database = selections.database;
    this.language = selections.language;
    this.server = selections.server;
    this.commonFiles = this.loadCommonFiles();
  }

  private loadCommonFiles(): CommonFiles {
    return {
      gitignore: `
  node_modules/
  .env.*
  dist/
  .DS_Store
  `,
      readme: this.generateReadme(),
      app: this.generateAppFile(),
      packageJson: this.generatePackageJson(),
    };
  }

  private generatePackageJson(): PackageJsonTemplate {
    const base = {
      version: "1.0.0",
      scripts: {
        start:
          this.language === "TypeScript"
            ? "ts-node src/server.ts"
            : "node src/server.js",
        test: "jest",
        build: this.language === "TypeScript" ? "tsc" : 'echo "No build step"',
      },
    };

    const dependencies = {
      common: {
        dotenv: "^16.4.7",
      },
      Express: {
        express: "^4.21.2",
      },
      Hono: {
        hono: "^4.6.16",
      },
      PostgreSQL: {
        pg: "^8.11.10",
      },
      MongoDB: {
        mongoose: "^7.8.3",
      },
      MySQL: {
        mysql2: "^3.12.0",
      },
      SQLite: {
        sqlite3: "^5.1.7",
      },
    };

    const devDependencies = {
      TypeScript: {
        typescript: "^5.7.3",
        "@types/node": "^22.10.5",
        "ts-node": "^10.9.2",
      },
    };

    return { base, dependencies, devDependencies };
  }

  private generateReadme(): string {
    return `# ${this.database} ${this.server} Project
    
A web server built with ${this.server}, ${this.database}, and ${this.language}.

## Getting Started

1. Install dependencies: \`npm install\`
2. Start the server: \`npm start\`
`;
  }

  private generateAppFile(): Map<string, string> {
    const files = new Map<string, string>();
    const ext = this.language === "TypeScript" ? "ts" : "js";

    // Generate app file content based on server framework
    const appContent =
      this.server === "Express"
        ? `import express${
            this.language === "TypeScript" ? ", { Express }" : ""
          } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app${this.language === "TypeScript" ? ": Express" : ""} = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

export default app;`
        : `import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => c.text('Hello World!'));

export default app;`;

    // Generate listener file content
    const listenerContent =
      this.server === "Express"
        ? `import app from './app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(\`Server listening on port \${PORT}\`);
});`
        : `import app from './app';

const PORT = process.env.PORT || 3000;

Deno.serve({ port: PORT }, app.fetch);`;

    files.set(`src/app.${ext}`, appContent);
    files.set(`src/server.${ext}`, listenerContent);

    return files;
  }

  private async getDatabaseFiles(): Promise<Map<string, string>> {
    const files = new Map<string, string>();
    const ext = this.language === "TypeScript" ? "ts" : "js";

    if (this.database === "PostgreSQL") {
      // PostgreSQL-specific folder structure
      files.set(
        `db/setup.sql`,
        `DROP DATABASE IF EXISTS database_name;
CREATE DATABASE database_name;

\\c database_name;

CREATE TABLE example (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);`
      );

      files.set(
        `db/connection.${ext}`,
        `import { Pool ${
          this.language === "TypeScript" ? ", PoolConfig" : ""
        } } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const config${this.language === "TypeScript" ? ": PoolConfig" : ""} = {
  connectionString: process.env.DATABASE_URL
};

export default new Pool(config);`
      );

      files.set(
        `db/seeds/seed.${ext}`,
        `import db from '../connection';

export const seed = async (data) => {
  // Add seeding logic here
};`
      );

      files.set(
        `db/seeds/run-seed.${ext}`,
        `import devData from '../data/dev-data';
import { seed } from './seed';

const runSeed = () => {
  return seed(devData);
};

runSeed();`
      );

      files.set(
        `db/data/dev-data/index.${ext}`,
        `export default {
  // Add development data here
};`
      );

      files.set(
        `db/data/test-data/index.${ext}`,
        `export default {
  // Add test data here
};`
      );
    } else {
      // Other databases keep the original config/database structure
      files.set(
        `config/database.${ext}`,
        generateDatabaseConfig(this.database, this.language)
      );
    }

    return files;
  }

  public async buildTemplate(): Promise<Map<string, string>> {
    const files = new Map<string, string>();

    // Add common files
    files.set(".gitignore", this.commonFiles.gitignore);
    files.set("README.md", this.commonFiles.readme);

    // Add database-specific files
    const dbFiles = await this.getDatabaseFiles();
    for (const [path, content] of dbFiles) {
      files.set(path, content);
    }

    // Add language-specific files
    if (this.language === "TypeScript") {
      files.set("tsconfig.json", this.generateTsConfig());
    }

    return files;
  }

  private generateTsConfig(): string {
    return `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}`;
  }
}

function generateDatabaseConfig(database: string, language: string): string {
  const isTS = language === "TypeScript";

  const configs: Record<string, string> = {
    PostgreSQL: `
  import { Pool ${isTS ? ", PoolConfig" : ""}} from 'pg';
  import dotenv from 'dotenv';
  
  dotenv.config();
  
  const config${isTS ? ": PoolConfig" : ""} = {
    connectionString: process.env.DATABASE_URL
  };
  
  export default new Pool(config);
  `,
    MongoDB: `
  import mongoose from 'mongoose';
  import dotenv from 'dotenv';
  
  dotenv.config();
  
  const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URI${
        isTS ? " as string" : ""
      });
      console.log('MongoDB connected');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      process.exit(1);
    }
  };
  
  export default connectDB;
  `,
    // Add other database configurations...
  };

  return configs[database] || "";
}

// Configuration object that defines all possible options
const OPTIONS: Option[] = [
  {
    id: "server",
    display: "Server Framework",
    choices: [
      { name: "Express", color: blue },
      { name: "Hono", color: yellow },
    ],
  },
  {
    id: "database",
    display: "Database",
    choices: [
      { name: "PostgreSQL", color: blue },
      { name: "MongoDB", color: green },
      { name: "MySQL", color: magenta },
      { name: "SQLite", color: cyan },
    ],
  },
  {
    id: "language",
    display: "Language",
    choices: [
      { name: "JavaScript", color: yellow },
      { name: "TypeScript", color: blue },
    ],
  },
];

// Define templates and their requirements
const TEMPLATES: Template[] = [
  {
    id: "pg-ts",
    requirements: {
      server: "Express",
      database: "PostgreSQL",
      language: "TypeScript",
    },
    color: blue,
  },
  {
    id: "pg",
    requirements: {
      server: "Express",
      database: "PostgreSQL",
      language: "JavaScript",
    },
    color: blueBright,
  },
  {
    id: "mongo-ts",
    requirements: {
      server: "Express",
      database: "MongoDB",
      language: "TypeScript",
    },
    color: green,
  },
  {
    id: "mongo",
    requirements: {
      server: "Express",
      database: "MongoDB",
      language: "JavaScript",
    },
    color: greenBright,
  },
  {
    id: "mysql-ts",
    requirements: {
      server: "Express",
      database: "MySQL",
      language: "TypeScript",
    },
    color: magenta,
  },
  {
    id: "mysql",
    requirements: {
      server: "Express",
      database: "MySQL",
      language: "JavaScript",
    },
    color: magenta,
  },
  {
    id: "sqlite-ts",
    requirements: {
      server: "Express",
      database: "SQLite",
      language: "TypeScript",
    },
    color: cyan,
  },
  {
    id: "sqlite",
    requirements: {
      server: "Express",
      database: "SQLite",
      language: "JavaScript",
    },
    color: cyan,
  },
  {
    id: "hono-pg-ts",
    requirements: {
      server: "Hono",
      database: "PostgreSQL",
      language: "TypeScript",
    },
    color: yellow,
  },
  {
    id: "hono-pg",
    requirements: {
      server: "Hono",
      database: "PostgreSQL",
      language: "JavaScript",
    },
    color: yellow,
  },
];

// Helper function to validate a template
function validateTemplate(template: Template): ValidationResult {
  const errors: string[] = [];
  if (!template.id) errors.push("Template ID is required");
  if (!template.requirements) errors.push("Template requirements are required");

  OPTIONS.forEach((option) => {
    if (!template.requirements[option.id]) {
      errors.push(`Missing requirements for ${option.id}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Validate all templates
TEMPLATES.forEach((template) => {
  const validResult = validateTemplate(template);
  if (!validResult.isValid) {
    console.warn(
      `Template ${template.id} has validation errors:`,
      validResult.errors
    );
  }
});

// Parse command line arguments
const argv = minimist<{
  template?: string;
  help?: boolean;
}>(process.argv.slice(2), {
  default: { help: false },
  alias: { h: "help", t: "template" },
  string: ["_"],
});

// Generate help message dynamically based on available options
function generateHelpMessage(): string {
  const templateList = TEMPLATES.map((t) => `${t.color(t.id.padEnd(20))}`).join(
    "\n"
  );

  return `Usage: create-mvc-server [options] [project-name]

Create a new project with your chosen configuration.
With no arguments, start the CLI in interactive mode.

Options:
  -t, --template NAME        Use a specific template
  -h, --help                 Display this help message

Available templates:
${templateList}`;
}

// Default target directory
const defaultTargetDir = "mvc-server";

// Check Node.js version
async function checkNodeVersion(
  requiredVersion: string = "14.0.0"
): Promise<boolean> {
  const currentVersion = process.versions.node;
  const semver = currentVersion.split(".").map(Number);
  const required = requiredVersion.split(".").map(Number);

  for (let i = 0; i < 3; i++) {
    if (semver[i] > required[i]) return true;
    if (semver[i] < required[i]) return false;
  }
  return true;
}

// Main function to initialise the project
async function init() {
  const argTargetDir = formatTargetDir(argv._[0]);
  const argTemplate = argv.template || argv.t;
  if (!(await checkNodeVersion())) {
    console.error(red("✖ Node.js 14.0.0 or higher is required"));
    process.exit(1);
  }

  if (argv.help) {
    console.log(generateHelpMessage());
    return;
  }

  // Early validation of template argument
  if (argTemplate) {
    const templateExists = TEMPLATES.some((t) => t.id === argTemplate);
    if (!templateExists) {
      console.error(red(`Template "${argTemplate}" not found.`));
      console.log("Available templates:");
      TEMPLATES.forEach((t) => console.log(`  ${t.color(t.id)}`));
      process.exit(1);
    }
  }

  let targetDir = argTargetDir || defaultTargetDir;
  const getProjectName = () => path.basename(path.resolve(targetDir));

  // Build prompts dynamically based on OPTIONS
  const questions: prompts.PromptObject[] = [
    {
      type: argTargetDir ? null : "text",
      name: "projectName",
      message: reset("Project name:"),
      initial: defaultTargetDir,
      onState: (state) => {
        targetDir = formatTargetDir(state.value) || defaultTargetDir;
      },
    },
    // Directory overwrite prompt
    {
      type: () =>
        !fs.existsSync(targetDir) || isEmpty(targetDir) ? null : "select",
      name: "overwrite",
      message: () =>
        `${
          targetDir === "."
            ? "Current directory"
            : `Target directory "${targetDir}"`
        } is not empty. Please choose how to proceed:`,
      choices: [
        { title: "Cancel operation", value: "no" },
        { title: "Remove existing files and continue", value: "yes" },
        { title: "Ignore files and continue", value: "ignore" },
      ],
    },
    // Package name prompt if needed
    {
      type: () => (isValidPackageName(getProjectName()) ? null : "text"),
      name: "packageName",
      message: reset("Package name:"),
      initial: () => toValidPackageName(getProjectName()),
      validate: (dir) => isValidPackageName(dir) || "Invalid package.json name",
    },
    {
      type: "confirm",
      name: "initGit",
      message: reset("Initialise a git repository?"),
    },
  ];

  // Add option prompts only if no template is specified
  if (!argTemplate) {
    OPTIONS.forEach((option) => {
      questions.push({
        type: "select",
        name: option.id,
        message: reset(`Select ${option.display}:`),
        choices: option.choices.map((choice) => ({
          title: choice.color(choice.name),
          value: choice.name,
        })),
      });
    });
  }

  try {
    const result = await prompts(questions, {
      onCancel: () => {
        throw new Error(red("✖") + " Operation cancelled");
      },
    });

    const { overwrite, packageName, initGit } = result;

    // Find matching template based on user selections or argument
    let template: Template | undefined;
    if (argTemplate) {
      template = TEMPLATES.find((t) => t.id === argTemplate);
    } else {
      template = TEMPLATES.find((t) => {
        return OPTIONS.every(
          (option) => t.requirements[option.id] === result[option.id]
        );
      });
    }

    if (!template) {
      throw new Error(
        "No matching template found for the selected configuration"
      );
    }

    const templateBuilder = new TemplateBuilder({
      database: template.requirements.database,
      language: template.requirements.language,
      server: template.requirements.server,
      projectName: packageName || getProjectName(),
    });
    const generatedFiles = await templateBuilder.buildTemplate();

    // Create root directory first
    const root = path.join(process.cwd(), targetDir);
    if (overwrite === "yes") {
      emptyDir(root);
    } else if (!fs.existsSync(root)) {
      fs.mkdirSync(root, { recursive: true });
    }

    // Write files, ensuring parent directories exist
    for (const [file, content] of generatedFiles) {
      const filePath = path.join(root, file);
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(filePath, content);
    }

    // Initialise git repository
    if (initGit) {
      execSync("git init", { stdio: "inherit", cwd: targetDir });
      execSync("git branch -M main", { stdio: "inherit", cwd: targetDir });
      console.log("Initialised git repository");
    }

    // Print final instructions
    const cdProjectName = path.relative(process.cwd(), root);
    console.log(`\nDone. Now run:\n`);
    if (root !== process.cwd()) {
      console.log(
        `  cd ${
          cdProjectName.includes(" ") ? `"${cdProjectName}"` : cdProjectName
        }`
      );
    }

    const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent);
    const pkgManager = pkgInfo ? pkgInfo.name : "npm";

    switch (pkgManager) {
      case "yarn":
        console.log("  yarn");
        break;
      default:
        console.log(`  ${pkgManager} install`);
        break;
    }
    console.log();
  } catch (cancelled: any) {
    console.log(cancelled.message);
    return;
  }
}

// Helper functions
function formatTargetDir(targetDir: string | undefined) {
  return targetDir?.trim().replace(/\/+$/g, "");
}

function copy(src: string, dest: string) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    copyDir(src, dest);
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Validate package name
function isValidPackageName(projectName: string) {
  return /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(
    projectName
  );
}

// Convert project name to valid package name
function toValidPackageName(projectName: string) {
  return projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/^[._]/, "")
    .replace(/[^a-z\d\-~]+/g, "-");
}

// Copy directory
function copyDir(srcDir: string, destDir: string) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file);
    const destFile = path.resolve(destDir, file);
    copy(srcFile, destFile);
  }
}

// Check if directory is empty
function isEmpty(path: string) {
  return (
    fs.readdirSync(path).length === 0 ||
    (fs.readdirSync(path).length === 1 && fs.readdirSync(path)[0] === ".git")
  );
}

// Empty directory
function emptyDir(dir: string) {
  if (!fs.existsSync(dir)) {
    return;
  }
  for (const file of fs.readdirSync(dir)) {
    if (file === ".git") {
      continue;
    }
    fs.rmSync(path.resolve(dir, file), { recursive: true, force: true });
  }
}

// Parse package manager from user agent
function pkgFromUserAgent(userAgent: string | undefined) {
  if (!userAgent) return undefined;
  const pkgSpec = userAgent.split(" ")[0];
  const pkgSpecArr = pkgSpec.split("/");
  return {
    name: pkgSpecArr[0],
    version: pkgSpecArr[1],
  };
}

init().catch((e) => {
  console.error(e);
});
