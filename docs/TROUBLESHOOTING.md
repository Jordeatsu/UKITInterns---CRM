# Troubleshooting

## Port already in use

If `start.sh` or `dev-start.sh` fails with `address already in use` or `EADDRINUSE`, something is already running on port 5008 or 3008. Run `bash stop.sh` first, then try again. If that does not clear it:

**Mac / Linux / Git Bash:**

```bash
lsof -ti :5008 | xargs kill -9
lsof -ti :3008 | xargs kill -9
```

**Windows (Command Prompt or PowerShell):**

```cmd
netstat -ano | findstr :5008
# Note the PID in the last column, then run:
taskkill /F /PID <PID>
```

Alternatively on Windows, open Task Manager → Details tab → find the `node.exe` process and click **End task**.

---

## White screen or "Failed to compile"

Check the terminal running the client — there will be a specific error with a file name and line number. Fix the error, save the file, and the browser will reload automatically (in dev mode).

---

## Codespaces app URL not opening

If the app does not open in browser from Codespaces:

1. Confirm services are running with `bash dev-start.sh` from `workshop/`
2. Open the **Ports** tab in Codespaces
3. Ensure port `3008` exists and is visible
4. Open port `3008` in browser

If the port is listed as private and you need to share it with teammates temporarily, change port visibility in the Ports panel.

---

## Codespace stopped and terminals disappeared

This is expected when a Codespace is stopped or suspended.

1. Reopen the same Codespace from the repo's **Code > Codespaces** menu
2. Open a new terminal
3. Restart services:

```bash
cd workshop && ./dev-start.sh
```

---

## "Cannot find module" after pulling changes

Someone on your team added a new package. Run `npm install` in both directories to pick it up:

```bash
cd workshop/server && npm install
cd ../client && npm install
```

---

## Changes not showing up

In production mode (`start.sh`), the client is a pre-built static bundle — it will not update automatically. Either run `bash build.sh` from `workshop/` to rebuild, or switch to dev mode (`bash dev-start.sh`) which updates on every save.

---

## "Failed to load case" or 401 errors everywhere

Your JWT has expired (they last 24 hours). Log out and log back in.

---

## Login gets rate-limited for everyone at once

If many users share one public IP in logs, the login rate limiter may be seeing proxy IPs instead of real client IPs.

Set `TRUST_PROXY` in `workshop/server/.env` to match your deployment:

```env
TRUST_PROXY=1
```

Use `1` for a single reverse proxy/load balancer hop, `2` for two hops, or `false` for local direct access.

---

## Database errors on startup

The database file may be corrupted or out of date. See [SETUP.md - Resetting the database](SETUP.md#resetting-the-database) for how to wipe and re-seed it cleanly.