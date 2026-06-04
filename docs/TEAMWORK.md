# Working as a Team

## Team collaboration guidelines

Four people on one codebase can get messy fast. A few things that help:

- **Divide by feature, not by file.** Agree on who is building what before anyone starts coding. If two people are both editing `Dashboard.jsx` at the same time, you will have conflicts.
- **Use branches.** Create a branch for each feature and merge back to `main` when it's working. In the terminal: `git checkout -b feature/your-name/feature-name`. In GitHub Desktop: **Branch → New branch**.
- **Fix the known issues together first.** Do this as a group before splitting off — it's the fastest way to get everyone familiar with the codebase at the same time.

---

## Branches, commits, and pull requests

This matters beyond just keeping the code tidy — it is how your work will be reviewed.

**Branches protect `main`.** Your `main` branch is your working product. Nobody should push directly to it. Build every feature or bug fix on its own branch, then merge it in via a pull request once it works. That way `main` is always in a state you could demo.

**Commits tell a story.** Each commit should capture one coherent piece of work — a bug fixed, a component added, a query written. A commit message like `"add status dropdown to CaseDetail"` is useful; `"stuff"` or a single 800-line commit at the end of the day is not. Small, well-described commits make it easy to see what you built and why.

**Pull requests are your paper trail.** When your branch is ready, open a pull request from your branch into `main`. This shows the full diff of your changes. Even if nobody reviews it before you merge, the PR history gives a clear record of who built what and when.

**Terminal:**

```bash
git checkout -b feature/alice/status-update   # create your branch
# ...write code, test it...
git add -p                                     # stage changes in small chunks
git commit -m "add status dropdown to CaseDetail"
git push origin feature/alice/status-update   # push to GitHub
# Then open a Pull Request on GitHub: your branch → main
```

**GitHub Desktop:**

1. Click **Current branch → New branch** and name it `feature/alice/status-update`
2. Write your code in VS Code
3. In the **Changes** panel, review your edits — untick any files you are not ready to commit yet
4. Write a short summary (e.g. `add status dropdown to CaseDetail`) and click **Commit to feature/alice/...**
5. Repeat steps 3–4 for each small piece of work as you go
6. Click **Publish branch** (first time) or **Push origin** to send your commits to GitHub
7. Click **Create Pull Request** — GitHub will open in the browser so you can open the PR

> **Why this is being looked at:** The commit history and pull requests on your fork are part of how individual contributions will be reviewed. A single commit with everything in it makes it very hard to see who did what and how they approached the problem. Lots of small, focused commits show your thinking as you go.

---

## Resolving merge conflicts

If two people edit the same lines in the same file on different branches, Git cannot automatically merge them. You will see this message when you try to merge or pull:

```
CONFLICT (content): Merge conflict in src/advisor/Dashboard.jsx
```

VS Code highlights the conflicting section with three markers:

```
<<<<<<< HEAD  (your version)
const title = 'My Dashboard';
=======
const title = 'Cases Dashboard';
>>>>>>> feature/bob/dashboard-title  (their version)
```

To resolve it:

1. Decide which version is correct — or write a combined version
2. Delete the conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`) and the version you do not want
3. Save the file
4. Stage the resolved file and commit

VS Code also has a built-in merge editor — when a conflict is open, click **Resolve in Merge Editor** to get a side-by-side view with **Accept Current**, **Accept Incoming**, and **Accept Both** buttons.

The best way to minimise conflicts is to keep branches short-lived, merge back to `main` often, and pull the latest `main` into your branch before you start a new piece of work.

---

## Presentation

At the end of the session you will give a short demo of your application. You should cover:

- **What you built** — walk through the features you added, live in the browser.
- **Why you chose them** — out of everything you could have built, why did these feel most important for CleanWave advisors?
- **What you'd add next** — if you had another hour, what would it be and why?

The emphasis is on the decisions you made, not just what works. A thoughtful explanation of a half-finished feature is worth more than a finished one nobody can explain.
