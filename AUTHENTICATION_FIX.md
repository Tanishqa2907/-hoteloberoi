# Fix GitHub Authentication for New Account

## ✅ Credentials Cleared!

The old account credentials have been removed. Now you need to authenticate with your new account.

## 🔐 Option 1: Personal Access Token (Recommended - Easiest)

### Step 1: Create Personal Access Token

1. Go to GitHub.com and log in as **Tanishqa2907**
2. Click your profile picture (top right) → **Settings**
3. Scroll down → **Developer settings** (left sidebar)
4. Click **Personal access tokens** → **Tokens (classic)**
5. Click **Generate new token** → **Generate new token (classic)**
6. Fill in:
   - **Note**: `hoteloberoi-project` (or any name)
   - **Expiration**: Choose 90 days or No expiration
   - **Select scopes**: Check **`repo`** (this selects all repo permissions)
7. Click **Generate token**
8. **⚠️ IMPORTANT**: Copy the token immediately! You won't see it again!

### Step 2: Push Using Token

```bash
git push -u origin main
```

When prompted:
- **Username**: `Tanishqa2907`
- **Password**: Paste your Personal Access Token (not your GitHub password!)

---

## 🔑 Option 2: SSH Authentication (More Secure)

### Step 1: Generate SSH Key (if you don't have one)

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

Press Enter to accept default location. Optionally set a passphrase.

### Step 2: Add SSH Key to GitHub

1. Copy your public key:
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```
   Or on Windows:
   ```bash
   type %USERPROFILE%\.ssh\id_ed25519.pub
   ```

2. Go to GitHub → Settings → SSH and GPG keys
3. Click **New SSH key**
4. Paste your public key
5. Click **Add SSH key**

### Step 3: Change Remote to SSH

```bash
git remote set-url origin git@github.com:Tanishqa2907/-hoteloberoi.git
```

### Step 4: Push

```bash
git push -u origin main
```

---

## 🚨 If You Still Get Errors

### Clear All GitHub Credentials

```bash
# List all credentials
cmdkey /list

# Delete specific ones
cmdkey /delete:LegacyGeneric:target=git:https://github.com
cmdkey /delete:LegacyGeneric:target=GitHub - https://api.github.com/Pavandange007
```

### Use Git Credential Manager

```bash
# Configure Git to use Windows Credential Manager
git config --global credential.helper manager-core

# Or use the built-in manager
git config --global credential.helper manager
```

---

## ✅ Quick Test

After setting up authentication, test it:

```bash
git push -u origin main
```

If successful, you should see your code on GitHub!

