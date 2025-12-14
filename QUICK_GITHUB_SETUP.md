# Quick Guide: Setup on Different GitHub Account

## 🚀 Quick Steps

### 1. Create New Repository on GitHub
- Go to your **new GitHub account**
- Click **"+" → "New repository"**
- Name it: `hoteloberoi` (or any name)
- **Don't** initialize with README
- Click **"Create repository"**

### 2. Change Remote (Choose One Method)

#### Method A: Use the Script (Windows)
```bash
# Run the helper script
change-github-remote.bat
```

#### Method B: Manual Commands
```bash
# Remove old remote
git remote remove origin

# Add new remote (replace USERNAME with your GitHub username)
git remote add origin https://github.com/USERNAME/hoteloberoi.git

# Verify
git remote -v
```

### 3. Commit & Push
```bash
# Commit all changes (if not already committed)
git commit -m "Production-ready hotel management system"

# Push to new repository
git push -u origin main
```

## 🔐 Authentication

If you get authentication errors:

**Option 1: Personal Access Token (HTTPS)**
1. GitHub → Settings → Developer settings → Personal access tokens
2. Generate token with `repo` permission
3. Use token as password when pushing

**Option 2: SSH (Recommended)**
1. Generate SSH key: `ssh-keygen -t ed25519 -C "your_email@example.com"`
2. Add to GitHub: Settings → SSH and GPG keys
3. Use SSH URL: `git@github.com:USERNAME/hoteloberoi.git`

## ✅ Verify

After pushing, check your new GitHub repository - all files should be there!

