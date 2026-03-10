# LUMIMAR deployment

This repo is split into:

- `frontend`: React + Vite storefront that can be deployed to GitHub Pages.
- `backend`: Node HTTP API that must run on a Node-capable host.

## What is configured

- GitHub Pages workflow: `.github/workflows/deploy-frontend.yml`
- SPA deep-link fallback for GitHub Pages: `frontend/public/404.html`
- Redirect restoration on app startup: `frontend/src/main.tsx`

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

## 4. Host the backend separately

GitHub Pages cannot run `backend/server.js`. Deploy the backend to a Node host such as:

- Hostinger VPS
- Render
- Railway

Set these backend environment variables on that host:

- `PORT`
- `FRONTEND_APP_URL=https://shop.yourdomain.com`
- `CORS_ORIGIN=https://shop.yourdomain.com`
- `PAYSTACK_SECRET_KEY`
- `PAYSTACK_CURRENCY`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `ORDER_NOTIFICATION_EMAIL`

## 5. Update the frontend API target

The deployed frontend reads `VITE_API_BASE_URL`. Set it to your hosted backend, for example:

```text
https://api.yourdomain.com
```

Without that variable, the frontend falls back to `http://localhost:4000`, which is only valid for local development.
