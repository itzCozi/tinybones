# TinyBones CLI

A command-line tool for managing your TinyBones blog content.

## Features

- Create new blog posts (MDX or Markdown)
- Create new projects
- List existing blog posts and projects
- Update your blog with the latest TinyBones template

## Installation

From your project root, run:

```bash
# Install the CLI tool dependencies and link it globally
npm run setup-cli
```

Or manually:

```bash
# Navigate to the CLI directory
cd scripts/tinybones-cli

# Install dependencies
npm install

# Link the CLI to make it available globally
npm link
```

## Usage

Once installed, you can use the CLI with either:

```bash
# Using the npm script
npm run tb -- <command> <args>

# Or directly if linked globally
tinybones <command> <args>
```

### Available Commands

#### Create a new blog post

```bash
tinybones create new-post
```

You'll be prompted for:

- Title
- Description
- Format (MDX or Markdown)

The tool will create a new directory in `src/content/blog/` with a slug based on the title and an index file with the current date as the publication date.

#### Create a new project

```bash
tinybones create new-project
```

You'll be prompted for:

- Title
- Description

The tool will create a new directory in `src/content/projects/` with a slug based on the title.

#### List blog posts

```bash
tinybones list posts
```

Displays a list of all blog posts with their titles, dates, and file paths.

#### List projects

```bash
tinybones list projects
```

Displays a list of all projects with their titles, descriptions, and file paths.

#### Update TinyBones template

```bash
tinybones update
```

Updates your blog with the latest TinyBones template while preserving your content. This command:

- Backs up your content
- Fetches the latest template
- Applies the template changes
- Restores your content
- Creates a new branch with the changes

## Help

For more information, run:

```bash
tinybones --help
```
