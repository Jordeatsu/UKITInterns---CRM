# Setup Guide

## Prerequisites

No local software installation is required for the workshop.

You only need:

- A GitHub account with access to your team repository
- A modern browser (Chrome, Edge, Firefox, or Safari)
- Stable internet access

---

## On the day

### 1. Open your team repository

1. Go to your team's GitHub repository in the browser
2. Confirm you are on the `main` branch before creating your Codespace

### 2. Create a Codespace from `main`

1. Click **Code**
2. Open the **Codespaces** tab
3. Click **Create codespace on main**

GitHub will provision a cloud development environment and open VS Code in the browser.

### 3. Verify the environment

Open a terminal in the Codespace and run:

```bash
node --version
npm --version
git --version
```

All required tools are preinstalled in the Codespace.

---

## Running the app in Codespaces

### 1. Seed the database (first run only)

```bash
cd workshop/server
npm install
npm run seed
```

This creates sample contacts, cases, products, complaint types, and advisor accounts.

### 2. Start development mode

From the `workshop/` directory:

```bash
cd /workspaces/UKITInterns---CRM/workshop
bash dev-start.sh
```

This starts:

1. API server on port `5008`
2. Client app on port `3008`
3. Hot reload for both frontend and backend

### 3. Open the app from forwarded ports

In Codespaces, use the **Ports** panel:

- Open port `3008` in browser for the app UI
- Keep port `5008` available for API access

Recommended URL paths:

- `/submit` for the consumer portal
- `/advisor/login` for the advisor portal

### 4. Stop the app

```bash
cd /workspaces/UKITInterns---CRM/workshop
bash dev-stop.sh
```

If needed, use `bash dev-restart.sh` to restart both services.

---

## Working habits for Codespaces

- Start each day by opening your existing Codespace or creating a new one from team `main`
- Do all coding in feature branches (not `main`)
- Commit and push regularly so your work is safely stored on GitHub
- Stop unused Codespaces when not working to reduce compute usage

---

## Resetting the database

If data becomes inconsistent, reset and reseed:

```bash
rm /workspaces/UKITInterns---CRM/workshop/server/crm.db
cd /workspaces/UKITInterns---CRM/workshop/server
npm run seed
```

This removes all current data and restores the original sample dataset.

---

## Login credentials

Seeded advisor accounts:

- `alice@crm.com`
- `bob@crm.com`
- `carol@crm.com`

Password for all accounts:

- `password123`
