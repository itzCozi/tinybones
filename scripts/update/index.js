#!/usr/bin/env node

/**
 * TinyBones Update Script
 *
 * This script updates a TinyBones-based blog with the latest template code
 * while preserving the user's content.
 */

import fs from "fs-extra";
import path from "path";
import { execSync } from "child_process";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const confirm = async (question) => {
  return new Promise((resolve) => {
    rl.question(`${question} (y/n): `, (answer) => {
      resolve(answer.toLowerCase() === "y" || answer.toLowerCase() === "yes");
    });
  });
};

const updateTinybones = async () => {
  try {
    console.log("🦴 TinyBones Update Script");
    console.log("============================");
    console.log(
      "This script will update your TinyBones blog with the latest template code"
    );
    console.log("while preserving your content.");
    console.log(
      "\n⚠️ Warning: Make sure to commit or back up your changes before proceeding!"
    );

    const shouldContinue = await confirm("\nDo you want to continue?");
    if (!shouldContinue) {
      console.log("Update cancelled.");
      rl.close();
      return;
    }

    const blogRoot = process.cwd();

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
          "Failed to parse .tinybones-config.json, using default configuration"
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
        console.log(`Backing up ${relativePath}...`);
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

      console.log(`Adding ${templateRepo} as a remote...`);
      execSync(
        `git remote add ${remoteName} https://github.com/${templateRepo}.git`,
        { stdio: "inherit" }
      );

      console.log(
        `Fetching latest template changes from ${templateRepo}:${templateBranch}...`
      );
      execSync(`git fetch ${remoteName} ${templateBranch}`, {
        stdio: "inherit",
      });

      const tempBranch = `tinybones-update-${Date.now()}`;
      console.log(`Creating temporary branch: ${tempBranch}`);
      execSync(
        `git checkout -b ${tempBranch} ${remoteName}/${templateBranch}`,
        { stdio: "inherit" }
      );

      console.log("\n🔄 Restoring your content...");

      for (const contentPath of contentPaths) {
        const relativePath = path.relative(blogRoot, contentPath);
        const backupPath = path.join(tempDir, relativePath);

        if (fs.existsSync(backupPath)) {
          console.log(`Restoring ${relativePath}...`);
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

      console.log(`Using ${packageManager} as package manager...`);
      execSync(`${packageManager} install`, { stdio: "inherit" });

      console.log("\n✅ Update complete!");
      console.log(
        `\nYour blog has been updated with the latest TinyBones template.`
      );
      console.log(`You are now on a new branch: ${tempBranch}`);
      console.log(
        `Review the changes, and if everything looks good, merge them into your main branch.`
      );
    } catch (error) {
      console.error("\n❌ Update failed:", error.message);
      console.log("Attempting to restore from backup...");

      for (const contentPath of contentPaths) {
        const relativePath = path.relative(blogRoot, contentPath);
        const backupPath = path.join(tempDir, relativePath);

        if (fs.existsSync(backupPath)) {
          console.log(`Restoring ${relativePath}...`);
          fs.removeSync(contentPath);
          fs.ensureDirSync(path.dirname(contentPath));
          fs.copySync(backupPath, contentPath);
        }
      }

      console.log(
        "Try to manually resolve the issues and run the update again."
      );
    }

    fs.removeSync(tempDir);
  } catch (error) {
    console.error("\n❌ An unexpected error occurred:", error.message);
  }

  rl.close();
};

// Run the update function
updateTinybones();
