# LUMIMAR deployment

This repo is split into:

- `frontend`: React + Vite storefront that can be deployed to GitHub Pages.
- `backend`: Node HTTP API that is configured for Render.

## What is configured

- GitHub Pages workflow: `.github/workflows/deploy-frontend.yml`
- SPA deep-link fallback for GitHub Pages: `frontend/public/404.html`
- Redirect restoration on app startup: `frontend/src/main.tsx`
- Render blueprint for the backend: `render.yaml`

## 1. Create the GitHub repo and push

Run these commands from the project root after you create an empty GitHub repository:

```powershell
git init -b main
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

## 2. Enable GitHub Pages for the frontend

In the GitHub repository:

1. Open `Settings > Pages`.
2. Set `Source` to `GitHub Actions`.
3. Open `Settings > Secrets and variables > Actions > Variables`.
4. Add `VITE_API_BASE_URL` with your backend URL, for example `https://api.yourdomain.com`.
5. Add `PAGES_CNAME` with your Hostinger subdomain, for example `shop.yourdomain.com`.

After the first push to `main`, the workflow deploys the `frontend` app from `frontend/dist`.

## 3. Point the Hostinger subdomain to GitHub Pages

In Hostinger DNS:

- Create a `CNAME` record for your storefront subdomain, for example `shop`.
- Point it to `<your-github-username>.github.io`.

Then wait for DNS propagation and confirm the same subdomain is set as `PAGES_CNAME` in GitHub.

## 4. Deploy the backend on Render

GitHub Pages cannot run `backend/server.js`, so the backend is configured for Render with `render.yaml`.

In Render:

1. Open `New + > Blueprint`.
2. Connect the same GitHub repository.
3. Render will detect `render.yaml` and create the `lumimar-backend` web service.
4. Set these values in Render when prompted or in the service environment settings:

- `FRONTEND_APP_URL=https://shop.yourdomain.com`
- `CORS_ORIGIN=https://shop.yourdomain.com`
- `PAYSTACK_SECRET_KEY`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `ORDER_NOTIFICATION_EMAIL`

The blueprint already sets:

- `rootDir=backend`
- `startCommand=npm start`
- `healthCheckPath=/api/health`
- `PAYSTACK_CURRENCY=KES`

After deploy, Render gives you a URL like:

```text
https://lumimar-backend.onrender.com
```

Use that as the initial frontend API base URL unless you later add a custom Render domain such as `api.yourdomain.com`.

## 5. Update the frontend API target

The deployed frontend reads `VITE_API_BASE_URL`. Set it to your hosted backend, for example:

```text
https://lumimar-backend.onrender.com
```

Without that variable, the frontend falls back to `http://localhost:4000`, which is only valid for local development.
