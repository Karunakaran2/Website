# Push Website to GitHub

Target layout: **one repo** on [github.com/Karunakaran2](https://github.com/Karunakaran2) with `website-frontend/`, `website-backend/`, and `infrastructure/` at the root.

Suggested repo name: **`website`** (private recommended until release-ready).

## 1. Finish local layout

- Close **npm dev**, **Java** run configs, and any terminal using `website-frontend/website-client`.
- Remove **leftover root folders** from before the move (they may only contain empty `target/`). From repo root:

```powershell
cd C:\Users\Karunakaran\git\Website
@(
  "website-client",
  "website-api-gateway",
  "website-auth-service",
  "website-content-service",
  "website-catalog-service",
  "website-media-service",
  "website-careers-service",
  "website-engagement-service",
  "website-notification-service",
  "website-service-registry"
) | ForEach-Object { if (Test-Path $_) { Remove-Item -Recurse -Force $_ } }
```

- Ensure nested git is removed (monorepo only):

```powershell
Remove-Item -Recurse -Force website-frontend\website-client\.git -ErrorAction SilentlyContinue
```

## 2. Initialize git at repo root

```powershell
cd C:\Users\Karunakaran\git\Website
git init -b main
git add -A
git status
```

Confirm **no** `.env`, `*.pem`, `node_modules/`, or `target/` are staged.

```powershell
git commit -m "Initial Website monorepo (website-frontend, website-backend, infrastructure)"
```

## 3. Create GitHub repo and push

Install [GitHub CLI](https://cli.github.com/) and sign in:

```powershell
gh auth login
gh repo create website --private --source=. --remote=origin --push
```

Or create an empty repo on GitHub, then:

```powershell
git remote add origin https://github.com/Karunakaran2/website.git
git push -u origin main
```

## 4. After push

- Re-open the **repo root** (`C:\Users\Karunakaran\git\Website`) in Cursor — remove old workspace entries that pointed at per-service folders; use `website-backend\...` and `website-frontend\...` instead.
- Update IDE run configurations: working directory `website-backend\website-*`.
- Optional: copy `infrastructure/website-infrastructure/ci/backend-verify.yml` to `.github/workflows/` (paths already use `website-backend/...`).

## Do not

- Push the old **design-system** remote from inside the client folder.
- Commit secrets (`postgres` prod passwords, JWT private keys in non-dev paths).
