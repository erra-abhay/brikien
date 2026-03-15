# Brikien Labs Monorepo

Welcome to the Brikien Labs monorepo. This repository contains the complete, self-hosted infrastructure for the Brikien Labs digital presence.

## Architecture

This project is built using a modern, monorepo architecture leveraging `pnpm` workspaces for efficient dependency management and code sharing.

### Workspaces
- `apps/public-web` (Port 3000): Next.js frontend for the public facing marketing site and blog.
- `apps/admin-dashboard` (Port 4000): Next.js secure portal for managing developers, projects, blogs, and site configuration.
- `apps/api` (Port 5000): Express.js + TS backend handling all database logic, authentication, and file storage.
- `packages/types`: Shared TypeScript interfaces across all applications.
- `packages/validators`: Shared Zod validation schemas ensuring type safety between frontend and backend.

### Services (Dockerized via `docker-compose.yml`)
- **API Server**
- **Admin Dashboard**
- **Public Web**
- **MongoDB**: Database container
- **Mailpit**: Local email testing and catching container
- **Nginx**: Reverse proxy routing traffic and serving static uploads

## Features
- **100% Self-Hosted**: No external dependencies like AWS S3 or Cloudinary. All files are stored locally via Docker volumes.
- **Robust Authentication**: Secure JWT HttpOnly cookies with access/refresh token rotation.
- **Monorepo Structure**: Shared schemas and types guarantee synchronization between frontend and backend.
- **Dynamic Content Management**: Fully functional CMS via the Admin Dashboard utilizing Tiptap editor.

---

## Development Setup

### Prerequisites
- Node.js v20+
- pnpm v8+
- Docker & Docker Compose

### 1. Initial Configuration

Install dependencies from the root directory:
```bash
pnpm install
```

Copy the environment file:
```bash
cp .env.example .env
```

Generate Strong Secrets for your `.env` file:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
*(Copy the output to `ACCESS_TOKEN_SECRET` and generate another for `REFRESH_TOKEN_SECRET`)*

### 2. Start Dependent Services
We need MongoDB and Mailpit running locally for development. Note that we do not build the Next.js apps via docker for local _development_.
```bash
docker compose up mongodb mailpit -d
```

### 3. Seed Database & Start Apps
Clear and seed the database with initial settings and an admin user (uses credentials from `.env`):
```bash
pnpm db:seed
```

Start all applications in development mode:
```bash
pnpm dev
```

### Local Access URLs
- **Public Website**: http://localhost:3000
- **Admin Dashboard**: http://localhost:4000 (Login with seeded credentials: admin@brikienlabs.tech / adminpassword)
- **API Server**: http://localhost:5000
- **Mailpit GUI**: http://localhost:8025

---

## Production Deployment

The production environment utilizes Docker Compose to orchestrate all services through a single Nginx reverse proxy.

1. Configure your server and point your domains to it.
2. Clone this repository to your server.
3. Update `.env` with production variables ensuring `PUBLIC_WEB_URL`, `NEXT_PUBLIC_API_URL` and `ADMIN_URL` match your domains.
4. Build and deploy:
   ```bash
   docker compose up --build -d
   ```

### Hardening Checklist
- [ ] Configure Nginx for SSL (HTTPS) via Let's Encrypt / Certbot.
- [ ] Replace `mailpit` SMTP credentials with a real production SMTP service (like SendGrid or AWS SES) in the `.env` file.
- [ ] Ensure Docker volumes (`mongodb_data`, `uploads_data`) are added to an automated backup rotation.
- [ ] Restrict database ports via firewall.

## License
Proprietary & Confidential - Brikien Labs
