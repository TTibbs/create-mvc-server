#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
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
      { name: "Postgres", color: blue },
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
      database: "Postgres",
      language: "TypeScript",
    },
    color: blue,
  },
  {
    id: "pg",
    requirements: {
      server: "Express",
      database: "Postgres",
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
      database: "Postgres",
      language: "TypeScript",
    },
    color: yellow,
  },
  {
    id: "hono-pg",
    requirements: {
      server: "Hono",
      database: "Postgres",
      language: "JavaScript",
    },
    color: yellow,
  },
];

// Helper function to find matching template based on selections
function findMatchingTemplate(
  selections: Record<string, string>
): Template | undefined {
  return TEMPLATES.find((template) => {
    return Object.entries(template.requirements).every(
      ([key, value]) => selections[key] === value
    );
  });
}

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
const renameFiles: Record<string, string | undefined> = {
  _gitignore: ".gitignore",
};

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

  // If template is provided, extract its requirements

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

    // If template was provided via argument, use it directly
    // Otherwise, find matching template based on user selections
    const template = argTemplate
      ? TEMPLATES.find((t) => t.id === argTemplate)
      : findMatchingTemplate(result);

    if (!template) {
      throw new Error(
        "No matching template found for the selected configuration"
      );
    }

    // Rest of your existing code for scaffolding the project
    const root = path.join(process.cwd(), targetDir);

    if (overwrite === "yes") {
      emptyDir(root);
    } else if (!fs.existsSync(root)) {
      fs.mkdirSync(root, { recursive: true });
    }

    const templateDir = path.resolve(
      fileURLToPath(import.meta.url),
      "../../",
      `template-${template.id}`
    );

    if (!fs.existsSync(templateDir)) {
      throw new Error(`Template ${template.id} not found`);
    }

    console.log(`\n${green("✔")} Creating project in ${blue(root)}`);

    // Copy template files
    const write = (file: string, content?: string) => {
      try {
        const targetPath = path.join(root, renameFiles[file] ?? file);
        if (content) {
          fs.writeFileSync(targetPath, content);
          console.log(`${green("✔")} Created ${blue(targetPath)}`);
        } else {
          copy(path.join(templateDir, file), targetPath);
          console.log(`${green("✔")} Created ${blue(targetPath)}`);
        }
      } catch (error: any) {
        console.error(`${red("✖")} Failed to write ${file}: ${error.message}`);
        throw error;
      }
    };

    // Initialise git repository
    if (initGit) {
      execSync("git init", { stdio: "inherit", cwd: targetDir });
      execSync("git branch -M main", { stdio: "inherit", cwd: targetDir });
      console.log("Initialised git repository");
    }

    const files = fs.readdirSync(templateDir);
    for (const file of files.filter((f) => f !== "package.json")) {
      write(file);
    }

    // Update package.json
    const pkg = JSON.parse(
      fs.readFileSync(path.join(templateDir, `package.json`), "utf-8")
    );

    pkg.name = packageName || getProjectName();
    write("package.json", JSON.stringify(pkg, null, 2) + "\n");

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
