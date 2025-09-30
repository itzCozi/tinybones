#!/usr/bin/env node

/**
 * TinyBones CLI - A command line tool for managing your TinyBones blog
 *
 * Commands:
 * - create new-post: Create a new blog post (MD/MDX)
 * - create new-project: Create a new project page
 * - list posts: List all blog posts
 * - list projects: List all projects
 * - update: Update your blog with the latest TinyBones template
 */

import { Command } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import slug from "slug";
import ora from "ora";
import { execSync } from "child_process";

const findProjectRoot = () => {
  let currentDir = process.cwd();

  while (!fs.existsSync(path.join(currentDir, "package.json"))) {
    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      throw new Error("Could not find project root (no package.json found)");
    }
    currentDir = parentDir;
  }

  return currentDir;
};

const projectRoot = findProjectRoot();
const contentRoot = path.join(projectRoot, "src", "content");

const getCurrentDateTimeISO = () => {
  return new Date().toISOString();
};

/**
 * Create a new blog post
 */
async function createNewPost() {
  const { title, description, format } = await inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "Enter the title for your blog post:",
      validate: (input) =>
        input.trim() !== "" ? true : "Title cannot be empty",
    },
    {
      type: "input",
      name: "description",
      message: "Enter a description for your blog post:",
      validate: (input) =>
        input.trim() !== "" ? true : "Description cannot be empty",
    },
    {
      type: "list",
      name: "format",
      message: "Choose the format:",
      choices: ["MDX", "Markdown"],
      default: "MDX",
    },
  ]);

  const sluggedTitle = slug(title.toLowerCase());
  const postDir = path.join(contentRoot, "blog", sluggedTitle);
  const extension = format === "MDX" ? "mdx" : "md";
  const filePath = path.join(postDir, `index.${extension}`);

  const frontmatter = `---
title: ${title}
description: ${description}
publicationDate: ${getCurrentDateTimeISO()}
comments: true
---

${
  format === "MDX"
    ? `
import InfoBox from "@/components/mdx/InfoBox.astro";
import Tabs from "@/components/mdx/Tabs.astro";
import TabPanel from "@/components/mdx/TabPanel.astro";
`
    : ""
}
# ${title}

Write your content here...
`;

  const spinner = ora("Creating new blog post...").start();

  try {
    await fs.ensureDir(postDir);

    if (await fs.pathExists(filePath)) {
      spinner.fail(`A post with the slug "${sluggedTitle}" already exists.`);
      return;
    }

    await fs.writeFile(filePath, frontmatter);

    spinner.succeed(`Blog post created at ${chalk.green(filePath)}`);
    console.log(`\nYou can now edit your post with your favorite editor.`);
  } catch (error) {
    spinner.fail(`Failed to create blog post: ${error.message}`);
  }
}

/**
 * Create a new project
 */
async function createNewProject() {
  const { title, description } = await inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "Enter the title for your project:",
      validate: (input) =>
        input.trim() !== "" ? true : "Title cannot be empty",
    },
    {
      type: "input",
      name: "description",
      message: "Enter a description for your project:",
      validate: (input) =>
        input.trim() !== "" ? true : "Description cannot be empty",
    },
  ]);

  const sluggedTitle = slug(title.toLowerCase());
  const projectDir = path.join(contentRoot, "projects", sluggedTitle);
  const filePath = path.join(projectDir, "index.md");

  const frontmatter = `---
title: ${title}
description: ${description}
publicationDate: ${getCurrentDateTimeISO()}
---

# ${title}

Write about your project here...
`;

  const spinner = ora("Creating new project...").start();

  try {
    await fs.ensureDir(projectDir);

    if (await fs.pathExists(filePath)) {
      spinner.fail(`A project with the slug "${sluggedTitle}" already exists.`);
      return;
    }

    await fs.writeFile(filePath, frontmatter);

    spinner.succeed(`Project created at ${chalk.green(filePath)}`);
    console.log(`\nYou can now edit your project with your favorite editor.`);
  } catch (error) {
    spinner.fail(`Failed to create project: ${error.message}`);
  }
}

/**
 * List all blog posts
 */
async function listPosts() {
  const spinner = ora("Fetching blog posts...").start();

  try {
    const blogDir = path.join(contentRoot, "blog");
    const postDirs = await fs.readdir(blogDir);

    if (postDirs.length === 0) {
      spinner.info("No blog posts found.");
      return;
    }

    const posts = [];

    for (const dir of postDirs) {
      const dirPath = path.join(blogDir, dir);
      const stat = await fs.stat(dirPath);

      if (stat.isDirectory()) {
        const files = await fs.readdir(dirPath);
        const indexFile = files.find((file) => file.startsWith("index."));

        if (indexFile) {
          const filePath = path.join(dirPath, indexFile);
          const content = await fs.readFile(filePath, "utf8");

          const titleMatch = content.match(/title:\s*([^\n]+)/);
          const dateMatch = content.match(/publicationDate:\s*([^\n]+)/);

          if (titleMatch && dateMatch) {
            posts.push({
              slug: dir,
              title: titleMatch[1].trim(),
              date: new Date(dateMatch[1].trim()),
              path: filePath,
            });
          }
        }
      }
    }

    posts.sort((a, b) => b.date - a.date);

    spinner.stop();

    console.log("\n" + chalk.bold("Blog Posts:") + "\n");
    posts.forEach((post, index) => {
      console.log(`${index + 1}. ${chalk.green(post.title)}`);
      console.log(`   Date: ${post.date.toLocaleDateString()}`);
      console.log(`   Slug: ${post.slug}`);
      console.log(`   Path: ${post.path}`);
      console.log();
    });
  } catch (error) {
    spinner.fail(`Failed to list blog posts: ${error.message}`);
  }
}

/**
 * List all projects
 */
async function listProjects() {
  const spinner = ora("Fetching projects...").start();

  try {
    const projectsDir = path.join(contentRoot, "projects");
    const projectDirs = await fs.readdir(projectsDir);

    if (projectDirs.length === 0) {
      spinner.info("No projects found.");
      return;
    }

    const projects = [];

    for (const dir of projectDirs) {
      const dirPath = path.join(projectsDir, dir);
      const stat = await fs.stat(dirPath);

      if (stat.isDirectory()) {
        const files = await fs.readdir(dirPath);
        const indexFile = files.find((file) => file.startsWith("index."));

        if (indexFile) {
          const filePath = path.join(dirPath, indexFile);
          const content = await fs.readFile(filePath, "utf8");

          const titleMatch = content.match(/title:\s*([^\n]+)/);
          const descMatch = content.match(/description:\s*([^\n]+)/);

          if (titleMatch) {
            projects.push({
              slug: dir,
              title: titleMatch[1].trim(),
              description: descMatch ? descMatch[1].trim() : "",
              path: filePath,
            });
          }
        }
      }
    }

    projects.sort((a, b) => a.title.localeCompare(b.title));

    spinner.stop();

    console.log("\n" + chalk.bold("Projects:") + "\n");
    projects.forEach((project, index) => {
      console.log(`${index + 1}. ${chalk.green(project.title)}`);
      if (project.description) {
        console.log(`   ${project.description}`);
      }
      console.log(`   Slug: ${project.slug}`);
      console.log(`   Path: ${project.path}`);
      console.log();
    });
  } catch (error) {
    spinner.fail(`Failed to list projects: ${error.message}`);
  }
}

/**
 * Update the blog with the latest TinyBones template
 */
async function updateTemplate() {
  const spinner = ora("Preparing to update TinyBones template...").start();

  try {
    const blogRoot = findProjectRoot();
    spinner.stop();

    console.log(chalk.bold("🦴 TinyBones Update"));
    console.log("============================");
    console.log(
      "This will update your TinyBones blog with the latest template code"
    );
    console.log("while preserving your content.");
    console.log(
      "\n" +
        chalk.yellow("⚠️ Warning:") +
        " Make sure to commit or back up your changes before proceeding!"
    );

    const { shouldContinue } = await inquirer.prompt([
      {
        type: "confirm",
        name: "shouldContinue",
        message: "Do you want to continue?",
        default: false,
      },
    ]);

    if (!shouldContinue) {
      console.log(chalk.yellow("Update cancelled."));
      return;
    }

    const configPath = path.join(blogRoot, ".tinybones-config.json");
    let config = {
      preservePaths: ["src/content", "public", "src/siteConfig.ts"],
      template: {
        repository: "itzCozi/tinybones",
        branch: "main",
      },
    };

    if (fs.existsSync(configPath)) {
      try {
        const configData = fs.readFileSync(configPath, "utf8");
        const loadedConfig = JSON.parse(configData);
        config = {
          ...config,
          ...loadedConfig,
          template: {
            ...config.template,
            ...(loadedConfig.template || {}),
          },
        };
        console.log("Loaded configuration from .tinybones-config.json");
      } catch (error) {
        console.warn(
          chalk.yellow(
            "Failed to parse .tinybones-config.json, using default configuration"
          )
        );
      }
    } else {
      console.log(
        "Using default configuration (no .tinybones-config.json found)"
      );
    }

    const contentPaths = config.preservePaths.map((relPath) =>
      path.join(blogRoot, relPath)
    );

    const tempDir = path.join(blogRoot, ".temp_update_backup");

    console.log("\n📦 Backing up your content...");
    fs.ensureDirSync(tempDir);

    for (const contentPath of contentPaths) {
      const relativePath = path.relative(blogRoot, contentPath);
      const backupPath = path.join(tempDir, relativePath);

      if (fs.existsSync(contentPath)) {
        console.log(`Backing up ${chalk.cyan(relativePath)}...`);
        fs.ensureDirSync(path.dirname(backupPath));
        fs.copySync(contentPath, backupPath);
      }
    }

    console.log("\n🔄 Fetching the latest TinyBones template...");

    try {
      const templateRepo = config.template.repository || "itzCozi/tinybones";
      const templateBranch = config.template.branch || "main";
      const remoteName = "tinybones-template";

      try {
        execSync(`git remote get-url ${remoteName}`, { stdio: "ignore" });
        execSync(`git remote remove ${remoteName}`, { stdio: "ignore" });
      } catch (error) {
        // Remote doesn't exist, which is fine
      }

      console.log(`Adding ${chalk.cyan(templateRepo)} as a remote...`);
      execSync(
        `git remote add ${remoteName} https://github.com/${templateRepo}.git`,
        { stdio: "inherit" }
      );

      console.log(
        `Fetching latest template changes from ${chalk.cyan(templateRepo + ":" + templateBranch)}...`
      );
      execSync(`git fetch ${remoteName} ${templateBranch}`, {
        stdio: "inherit",
      });

      const tempBranch = `tinybones-update-${Date.now()}`;
      console.log(`Creating temporary branch: ${chalk.cyan(tempBranch)}`);
      execSync(
        `git checkout -b ${tempBranch} ${remoteName}/${templateBranch}`,
        { stdio: "inherit" }
      );

      console.log("\n🔄 Restoring your content...");

      for (const contentPath of contentPaths) {
        const relativePath = path.relative(blogRoot, contentPath);
        const backupPath = path.join(tempDir, relativePath);

        if (fs.existsSync(backupPath)) {
          console.log(`Restoring ${chalk.cyan(relativePath)}...`);
          fs.removeSync(contentPath);
          fs.ensureDirSync(path.dirname(contentPath));
          fs.copySync(backupPath, contentPath);
        }
      }

      if (fs.existsSync(configPath)) {
        const backupConfigPath = path.join(tempDir, ".tinybones-config.json");
        if (fs.existsSync(backupConfigPath)) {
          fs.copySync(backupConfigPath, configPath);
        }
      }

      console.log("\n📦 Installing dependencies...");

      let packageManager = "npm";
      if (fs.existsSync(path.join(blogRoot, "pnpm-lock.yaml"))) {
        packageManager = "pnpm";
      } else if (fs.existsSync(path.join(blogRoot, "yarn.lock"))) {
        packageManager = "yarn";
      } else if (fs.existsSync(path.join(blogRoot, "bun.lockb"))) {
        packageManager = "bun";
      }

      console.log(`Using ${chalk.cyan(packageManager)} as package manager...`);
      execSync(`${packageManager} install`, { stdio: "inherit" });

      console.log("\n" + chalk.green("✅ Update complete!"));
      console.log(
        `\nYour blog has been updated with the latest TinyBones template.`
      );
      console.log(`You are now on a new branch: ${chalk.cyan(tempBranch)}`);
      console.log(
        `Review the changes, and if everything looks good, merge them into your main branch.`
      );
    } catch (error) {
      console.error("\n" + chalk.red("❌ Update failed:"), error.message);
      console.log("Attempting to restore from backup...");

      for (const contentPath of contentPaths) {
        const relativePath = path.relative(blogRoot, contentPath);
        const backupPath = path.join(tempDir, relativePath);

        if (fs.existsSync(backupPath)) {
          console.log(`Restoring ${chalk.cyan(relativePath)}...`);
          fs.removeSync(contentPath);
          fs.ensureDirSync(path.dirname(contentPath));
          fs.copySync(backupPath, contentPath);
        }
      }

      console.log(
        chalk.yellow(
          "Try to manually resolve the issues and run the update again."
        )
      );
    }

    fs.removeSync(tempDir);
  } catch (error) {
    spinner.fail(`An unexpected error occurred: ${error.message}`);
  }
}

/**
 * Main CLI program
 */
async function main() {
  const program = new Command();

  program
    .name("tinybones")
    .description("CLI tool for managing your TinyBones blog")

  program
    .command("create")
    .description("Create a new blog post or project")
    .argument("<type>", "Type of content to create (new-post, new-project)")
    .action(async (type) => {
      switch (type) {
        case "new-post":
          await createNewPost();
          break;
        case "new-project":
          await createNewProject();
          break;
        default:
          console.error(`Unknown type: ${type}`);
          console.log("Available types: new-post, new-project");
      }
    });

  program
    .command("list")
    .description("List blog posts or projects")
    .argument("<type>", "Type of content to list (posts, projects)")
    .action(async (type) => {
      switch (type) {
        case "posts":
          await listPosts();
          break;
        case "projects":
          await listProjects();
          break;
        default:
          console.error(`Unknown type: ${type}`);
          console.log("Available types: posts, projects");
      }
    });

  program
    .command("update")
    .description("Update your blog with the latest TinyBones template")
    .action(async () => {
      await updateTemplate();
    });

  program.parse(process.argv);

  if (!process.argv.slice(2).length) {
    program.outputHelp();
  }
}

main().catch((err) => {
  console.error(chalk.red(`Error: ${err.message}`));
  process.exit(1);
});
