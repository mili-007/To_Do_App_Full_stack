# GitHub Upload Guide

This guide will help you upload your To-Do App to GitHub.

## Prerequisites

1. **Git installed** on your computer
   - Download from: https://git-scm.com/downloads
   - Verify installation: `git --version`

2. **GitHub account**
   - Create at: https://github.com

## Step-by-Step Instructions

### Option 1: Upload Entire Project as One Repository (Recommended)

#### Step 1: Initialize Git Repository

Open terminal/command prompt in the project root directory (`To-Do-App`):

```bash
cd D:\MP_Project\To-Do-App
git init
```

#### Step 2: Add All Files

```bash
git add .
```

#### Step 3: Create Initial Commit

```bash
git commit -m "Initial commit: Full-stack To-Do App with database relationships"
```

#### Step 4: Create Repository on GitHub

1. Go to https://github.com
2. Click the **"+"** icon in the top right
3. Select **"New repository"**
4. Repository name: `todo-app` (or your preferred name)
5. Description: "Full-stack To-Do App with React, Node.js, and MongoDB"
6. Choose **Public** or **Private**
7. **DO NOT** initialize with README, .gitignore, or license (we already have these)
8. Click **"Create repository"**

#### Step 5: Connect and Push to GitHub

GitHub will show you commands. Use these:

```bash
# Add remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/todo-app.git

# Rename main branch (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

You'll be prompted for your GitHub username and password (or personal access token).

---

### Option 2: Separate Repositories for Backend and Frontend

If you prefer separate repositories:

#### Backend Repository

```bash
cd todo-app-backend
git init
git add .
git commit -m "Initial commit: To-Do App Backend"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/todo-app-backend.git
git push -u origin main
```

#### Frontend Repository

```bash
cd todo-app-frontend
git init
git add .
git commit -m "Initial commit: To-Do App Frontend"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/todo-app-frontend.git
git push -u origin main
```

---

## Important Notes

### ⚠️ Before Pushing

1. **Check for sensitive files**: Make sure `.env` files are in `.gitignore`
2. **Remove node_modules**: Already in `.gitignore`, but verify
3. **Review files**: Check what will be committed with `git status`

### 🔐 GitHub Authentication

If you get authentication errors:

1. **Use Personal Access Token** instead of password:
   - Go to GitHub → Settings → Developer settings → Personal access tokens
   - Generate new token with `repo` permissions
   - Use token as password when pushing

2. **Or use SSH**:
   ```bash
   # Generate SSH key (if you don't have one)
   ssh-keygen -t ed25519 -C "your_email@example.com"
   
   # Add to GitHub: Settings → SSH and GPG keys → New SSH key
   
   # Use SSH URL instead
   git remote set-url origin git@github.com:YOUR_USERNAME/todo-app.git
   ```

### 📝 After Uploading

1. **Add README**: Your README.md will be displayed on the repository page
2. **Add Topics**: Go to repository → ⚙️ Settings → Topics → Add topics like:
   - `react`
   - `nodejs`
   - `mongodb`
   - `typescript`
   - `express`
   - `redux`
   - `todo-app`

3. **Add Description**: Update repository description

4. **Create .env.example files** (optional but recommended):

   **Backend** (`todo-app-backend/.env.example`):
   ```env
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=your-secret-key-here
   PORT=5000
   NODE_ENV=development
   ```

   **Frontend** (`todo-app-frontend/.env.example`):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

## Troubleshooting

### Error: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/todo-app.git
```

### Error: "failed to push some refs"
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### Check what will be committed
```bash
git status
```

### View .gitignore is working
```bash
git status --ignored
```

## Quick Commands Reference

```bash
# Check status
git status

# Add files
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push origin main

# Pull latest changes
git pull origin main

# View commit history
git log

# Check remote URL
git remote -v
```

## Next Steps

After uploading:

1. ✅ Share your repository link
2. ✅ Add collaborators (if needed)
3. ✅ Set up GitHub Actions for CI/CD (optional)
4. ✅ Add issues and project board (optional)
5. ✅ Create releases (optional)

---

**Congratulations!** 🎉 Your To-Do App is now on GitHub!

