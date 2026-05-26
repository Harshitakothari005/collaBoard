# Free Deployment: Render + Aiven MySQL

This setup deploys the app as one browser-facing web service on Render:

```text
https://your-render-app.onrender.com
```

Inside that one web service:

- nginx serves the React frontend.
- nginx proxies `/api` and `/ws` to the Spring Boot backend.
- Spring Boot connects to Aiven free MySQL.

## 1. Create Free MySQL On Aiven

1. Create an Aiven account.
2. Create a free MySQL service.
3. Copy these values from the Aiven service page:
   - Host
   - Port
   - User
   - Password
   - Database name

Your Render `DB_URL` should look like this:

```text
jdbc:mysql://AIVEN_HOST:AIVEN_PORT/AIVEN_DATABASE?useSSL=true&serverTimezone=UTC&allowPublicKeyRetrieval=true
```

## 2. Push This Project To GitHub

Render deploys from a GitHub/GitLab repository. Commit these deployment files and push the project.

## 3. Deploy On Render

1. Open Render Dashboard.
2. Choose `New` -> `Blueprint`.
3. Select this repository.
4. Render will read `render.yaml`.
5. Enter these environment variables when Render asks:

```text
DB_URL=jdbc:mysql://AIVEN_HOST:AIVEN_PORT/AIVEN_DATABASE?useSSL=true&serverTimezone=UTC&allowPublicKeyRetrieval=true
DB_USERNAME=AIVEN_USER
DB_PASSWORD=AIVEN_PASSWORD
```

The service uses Render's free plan.

## 4. Open The App

After deploy finishes, open the Render URL:

```text
https://collaborative-whiteboard.onrender.com
```

If that exact subdomain is unavailable, Render will show the actual service URL in the dashboard.

## Free Plan Notes

- Render free services can sleep after inactivity, so the first request after a while may be slow.
- Aiven's free MySQL storage is limited, but enough for this mini project.
- Do not store production secrets in Git. Add database values only in the Render dashboard.
