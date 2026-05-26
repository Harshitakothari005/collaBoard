# Docker Deployment

This project includes Docker files for the full stack:

- `docker-compose.yml` starts MySQL, Spring Boot backend, and nginx-hosted React frontend.
- `backend/Dockerfile` builds and runs the Spring Boot JAR.
- `frontend/Dockerfile` builds the Vite app and serves it with nginx.
- `frontend/nginx.conf` serves React routes and proxies `/api` and `/ws` to the backend.
- `.env.example` contains deployment variables.

## Run With Docker Compose

```powershell
copy .env.example .env
docker compose up --build
```

Open the app at:

```text
http://localhost:3000
```

Default browser URL:

```text
Frontend: http://localhost:3000
```

The backend is private inside Docker. Browser traffic goes through nginx on the frontend container, and MySQL is exposed locally for tools such as MySQL Workbench:

```text
http://localhost:3000/api -> backend:8080/api
ws://localhost:3000/ws   -> backend:8080/ws
backend                 -> database:3306
MySQL Workbench         -> localhost:3307
```

For production, change the passwords in `.env` before deploying. If your frontend and backend are deployed on separate domains, set `VITE_API_BASE_URL` and `VITE_WS_URL` in `.env` to the public backend URLs, then rebuild the frontend image.
