# GitHub Repository Setup Instructions

## Step 1: Create a GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Fill in the repository details:
   - **Repository name**: `mern-ecommerce-app` (or your preferred name)
   - **Description**: "Full-stack e-commerce application built with React, Node.js, Express, and MongoDB"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click "Create repository"

## Step 2: Push Your Code to GitHub

After creating the repository, GitHub will show you commands. Use these commands in your terminal:

```bash
# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/mern-ecommerce-app.git

# Rename branch to main (if needed)
git branch -M main

# Push your code
git push -u origin main
```

## Alternative: Using SSH (if you have SSH keys set up)

```bash
git remote add origin git@github.com:YOUR_USERNAME/mern-ecommerce-app.git
git branch -M main
git push -u origin main
```

## After Pushing

Your code will be available on GitHub! You can:
- View your repository at: `https://github.com/YOUR_USERNAME/mern-ecommerce-app`
- Share the repository with others
- Set up CI/CD pipelines
- Deploy to platforms like Heroku, Vercel, or AWS

## Important Notes

- Make sure your `.env` file is in `.gitignore` (it already is)
- Never commit sensitive information like API keys or passwords
- The `node_modules` folder is already ignored

