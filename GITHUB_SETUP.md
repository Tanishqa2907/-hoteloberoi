# Setting Up Project on Different GitHub Account

## Step 1: Create a New Repository on GitHub

1. Log in to your **new GitHub account**
2. Click the **"+"** icon in the top right corner
3. Select **"New repository"**
4. Fill in the details:
   - **Repository name**: `hoteloberoi` (or any name you prefer)
   - **Description**: "Hotel Management System - Full Stack Application"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click **"Create repository"**

## Step 2: Update Git Remote

After creating the new repository, GitHub will show you the repository URL. Use one of these methods:

### Option A: Change Remote URL (Recommended)

```bash
# Remove the old remote
git remote remove origin

# Add the new remote (replace USERNAME with your new GitHub username)
git remote add origin https://github.com/USERNAME/hoteloberoi.git

# Or if using SSH (recommended for better security)
git remote add origin git@github.com:USERNAME/hoteloberoi.git
```

### Option B: Update Existing Remote

```bash
# Update the remote URL directly
git remote set-url origin https://github.com/USERNAME/hoteloberoi.git

# Or with SSH
git remote set-url origin git@github.com:USERNAME/hoteloberoi.git
```

## Step 3: Verify Remote

```bash
git remote -v
```

You should see your new repository URL.

## Step 4: Push to New Repository

```bash
# First, commit all your changes (if not already committed)
git add .
git commit -m "Initial commit: Production-ready hotel management system"

# Push to the new repository
git push -u origin main
```

If you get an authentication error, you may need to:
- Use a Personal Access Token instead of password
- Set up SSH keys for authentication

## Step 5: Authentication Setup

### Using Personal Access Token (HTTPS)

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate a new token with `repo` permissions
3. Use the token as your password when pushing

### Using SSH (Recommended)

1. Generate SSH key (if you don't have one):
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```

2. Add SSH key to ssh-agent:
   ```bash
   eval "$(ssh-agent -s)"
   ssh-add ~/.ssh/id_ed25519
   ```

3. Copy public key:
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```

4. Add to GitHub: Settings → SSH and GPG keys → New SSH key

## Troubleshooting

### If you get "repository not found" error:
- Make sure you're logged into the correct GitHub account
- Verify the repository name matches exactly
- Check that you have push access to the repository

### If you want to keep both remotes:
```bash
# Add new remote with a different name
git remote add new-origin https://github.com/NEW_USERNAME/hoteloberoi.git

# Push to specific remote
git push new-origin main
```

### To see all remotes:
```bash
git remote -v
```

