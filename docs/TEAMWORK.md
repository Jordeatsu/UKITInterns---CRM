# Working as a Team

## Team rules

- Use one shared team repository
- Treat `UKIT-Interns-Group-X-Main` as protected working code
- Never build directly on `UKIT-Interns-Group-X-Main`
- Build each task on a feature branch
- Open a pull request (PR) back into `UKIT-Interns-Group-X-Main`

---

## Daily workflow in Codespaces

### 1. Start from team `UKIT-Interns-Group-X-Main`

In your Codespace terminal:

```bash
git checkout UKIT-Interns-Group-X-Main
git pull --rebase origin UKIT-Interns-Group-X-Main
```

### 2. Create a feature branch

Branch naming format:

- `group-x-feature-<name>-<short-feature>`
- `group-x-fix-<name>-<short-fix>`

Example:

```bash
git checkout -b group-1-feature-alex-case-status-chips
```

### 3. Build and test your changes

The application supports hot swapping as long as the application is running in dev mode while you work:

```bash
cd workshop && ./dev-start.sh
```

### 4. Stage and commit

Check what changed:

```bash
git status
```

Stage specific files:

```bash
git add path/to/file1 path/to/file2
```

Or stage everything changed:

```bash
git add .
```

Commit with a clear message:

```bash
git commit -m "add advisor case status filter"
```

### 5. Push your branch

First push:

```bash
git push -u origin group-1-feature-alex-case-status-chips
```

Next pushes:

```bash
git push
```

### 6. Open a pull request

1. Go to your repository on GitHub
2. Click **Compare & pull request** for your branch
3. Set base to `UKIT-Interns-Group-X-Main`
4. Add a short summary of what changed
5. Create the PR

### 7. Keep your branch up to date with `UKIT-Interns-Group-X-Main`

If your branch is open for a while:

```bash
git fetch origin
git rebase origin/UKIT-Interns-Group-X-Main
```

If rebase succeeds:

```bash
git push --force-with-lease
```

---

## Pulling latest team changes

Use this when someone else's PR has already merged into `UKIT-Interns-Group-X-Main`.

```bash
git checkout UKIT-Interns-Group-X-Main
git pull --rebase origin UKIT-Interns-Group-X-Main
```

Then update your feature branch:

```bash
git checkout group-X-feature-alex-case-status-chip
git rebase UKIT-Interns-Group-X-Main
```

---

## Merge conflict quick guide

When Git reports a conflict:

1. Open the conflicted file in VS Code
2. Resolve using merge editor or manually
3. Stage resolved files:

```bash
git add <resolved-file>
```

4. Continue rebase:

```bash
git rebase --continue
```

5. Push branch after conflict resolution:

```bash
git push --force-with-lease
```

---

## GitHub troubleshooting

### Problem: "divergent branches" on pull

Use explicit strategy:

```bash
git pull --rebase origin UKIT-Interns-Group-X-Main
```

Set default once:

```bash
git config pull.rebase true
```

### Problem: push rejected (non-fast-forward)

Your branch is behind remote. Run:

```bash
git fetch origin
git rebase origin/<your-branch>
git push --force-with-lease
```

### Problem: committed to `UKIT-Interns-Group-X-Main` by mistake

If not pushed yet:

```bash
git checkout -b group-x-feature-<name>-<task>
```

Then switch back to `UKIT-Interns-Group-X-Main` and sync it:

```bash
git checkout UKIT-Interns-Group-X-Main
git pull --rebase origin UKIT-Interns-Group-X-Main
```

If already pushed to `UKIT-Interns-Group-X-Main`, open a follow-up PR that reverts the commit instead of rewriting shared history.

### Problem: forgot to stage a file before commit

Stage and amend:

```bash
git add <file>
git commit --amend --no-edit
git push --force-with-lease
```

### Problem: wrong branch checked out

Check current branch:

```bash
git branch --show-current
```

Switch branch:

```bash
git checkout <branch-name>
```

---

## Codespaces tips for teams

- Use one Codespace per person (do not share one running environment)
- Keep commits small and frequent
- Push before ending your session
- Stop inactive Codespaces from the GitHub Codespaces page
- Reopen the same Codespace next session to keep terminal history and local branch state

---

## Suggested commit message format

- `feat: add advisor dashboard filters`
- `fix: correct case priority validation`
- `docs: update setup for Codespaces workflow`
- `refactor: split case detail sections`

---

## Presentation checklist

At demo time, be ready to show:

- What each teammate built
- Which branches/PRs were used
- Key technical decisions made
- What you would improve next
