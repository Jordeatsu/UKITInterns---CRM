# Setup Guide

## Prerequisites

Install all of the following before running the project.

### 1. Node.js (v18 or later)

Download the **LTS** installer from:

> https://nodejs.org/en/download

Run the installer and accept all defaults. Verify:

```bash
node --version   # should print v18.x.x or higher
npm --version    # should print 9.x.x or higher
```

### 2. Visual Studio Code

> https://code.visualstudio.com/download

### 3. Git

> https://git-scm.com/downloads

### 4. Git Bash (Windows only)

Mac and Linux users already have a compatible terminal. On **Windows**, the shell scripts (`.sh` files) that start and stop the app require Git Bash, which is bundled with Git for Windows.

**Setting Git Bash as your default terminal in VS Code:**

1. Open VS Code
2. Press `Ctrl + Shift + P` → type `Terminal: Select Default Profile` → press Enter
3. Select **Git Bash**
4. Close any open terminals and open a new one with `` Ctrl + ` ``

Verify:

```bash
bash --version
# GNU bash, version 5.x.x
```

### 5. GitHub Desktop (optional)

If you prefer a graphical interface for Git over the command line, GitHub Desktop handles cloning, branching, committing, and opening pull requests without typing any `git` commands.

> https://desktop.github.com

GitHub Desktop includes its own bundled Git, but you should still install Git separately (step 3) so that the terminal commands used to run the app also have access to it.

### 6. Recommended VS Code Extensions

| Extension | Publisher | Purpose |
|---|---|---|
| **SQLite Viewer** | Florian Klampfer | Browse the database file visually |
| **ESLint** | Microsoft | JavaScript linting |
| **Prettier** | Prettier | Code formatting |

Install via `Ctrl+Shift+X` → search the name → Install.

---

## On the day

### Setting up your team repository

Do this once at the start — **one person per team** completes steps 1–3, then everyone else does step 4 & 5.

**1. Fork the repo (one person only)**

1. Go to the repository on GitHub
2. Click the **Fork** button in the top-right corner
3. Leave all settings as default and click **Create fork**
4. You now have your own copy of the repo under your GitHub account — this is where your team will do all their work

**2. Add your teammates as collaborators (one person only)**

1. On your fork, go to **Settings → Collaborators**
2. Click **Add people**
3. Search for each teammate's GitHub username and invite them
4. Each teammate will receive an email invitation — they must accept it before they can push

**3. Share the fork URL with your team**

Copy the URL of your fork (e.g. `https://github.com/your-username/repo-name`) and send it to your teammates.

**4. Clone the fork (everyone, including the person who forked it)**

Everyone should be cloning the **fork**, not the original repo.

**Terminal:**

```bash
git clone https://github.com/<fork-owners-username>/<repo-name>.git
cd <repo-name>
```

**GitHub Desktop:**

1. Open GitHub Desktop
2. Go to **File → Clone repository**
3. Click the **URL** tab
4. Paste the fork URL and choose a local path
5. Click **Clone**

**5. Verify you're set up correctly**

**Terminal:**

```bash
git remote -v
# Should show the fork URL, not the original repo URL
```

**GitHub Desktop:** Go to **Repository → Repository settings → Remotes** — the URL shown should be your fork, not the original.

---

## Running the app

Once you have cloned your team's fork, follow these steps to get the app running.

### 1. Seed the database with sample data

Before starting for the first time, populate the database with CleanWave complaints:

```bash
cd workshop/server
npm install
npm run seed
```

This creates 40 sample cases, 24 contacts, the full product catalogue, and the advisor accounts. See [Database documentation](DATABASE.md#seed-data) for login credentials.

### 2. Start the application (Production)

From the `workshop/` directory:

```bash
bash start.sh
```

This will:
1. Install/update dependencies in both `server/` and `client/`
2. Build the React client
3. Start the API server on port **5008**
4. Serve the built client on port **3008**
5. Print the URL others on the same network can use to access the app

| URL | Description |
|---|---|
| `http://localhost:3008/submit` | Consumer portal — submit a complaint |
| `http://localhost:3008/advisor/login` | Advisor login |

> **LAN access:** When `start.sh` runs it will also print a `LAN:` URL (e.g. `http://192.168.1.x:3008`). Anyone on the same Wi-Fi network can use that URL to access the app from their own device.

### 3. Stop the application

```bash
bash stop.sh
```

### Development mode (hot reload)

For active development, use `dev-start.sh` from the `workshop/` directory — it starts everything with hot reload so you don't need to rebuild after every change:

```bash
bash dev-start.sh
```

The server restarts automatically when you save a backend file. The browser updates instantly when you save a frontend file. Use this while you're actively writing code.

Switch to `start.sh` (production build) when you want to do a final demo or check that everything works in its built form — it's slower to start but reflects exactly what users would see.

Alternatively, you can run server and client manually in separate terminals:

```bash
# Terminal 1 — API server with auto-reload
cd workshop/server
npm run dev

# Terminal 2 — Vite dev server
cd workshop/client
npm run dev
```

### Resetting the database

If the database gets into a bad state — corrupt data, a failed migration, or you just want a clean slate — delete the file and re-seed:

```bash
rm workshop/server/crm.db
cd workshop/server
npm run seed
```

This wipes everything and rebuilds with the original 40 sample cases. You will lose any data added during the session.
