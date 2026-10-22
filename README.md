# MLA E-Office

A digital office management application for correspondence, visitors, development works, reports, and calendar workflows, with bilingual interface support.

**React 19 · Vite · Node.js / Express · Sequelize · MySQL**

## Purpose

The project brings office records and day-to-day tracking into a web interface. It combines a separate frontend and API with supporting documentation, letter templates, wireframes, and sample data.

## Architecture

`React web application → Express API → Sequelize → MySQL`

| Layer | Technologies |
| --- | --- |
| Web | React, React Router, Vite, Axios, Zustand, Lucide icons |
| API | Node.js, Express, Joi, JWT, bcryptjs |
| Data | Sequelize, MySQL, Sequelize CLI migrations and seeds |
| Packaging | Dockerfiles and root Docker Compose configuration |

## Repository structure

| Path | Contents |
| --- | --- |
| `web/` | Frontend application |
| `api/` | Backend application and database tooling |
| `docs/` | Supporting documentation |
| `LETTER_TEMPLATES/` | Letter template assets |
| `SAMPLE_DATA/` | Sample data resources |
| `WIREFRAMES/` | Interface planning assets |
| `markdown/`, `md/` | Additional project documents |
| `docker-compose.yml` | Container configuration |

## Local development

### Prerequisites

- Node.js **20 or newer** for the API. Also check the frontend's Vite requirements when choosing a Node.js version.
- npm.
- A MySQL database accessible from the API.

### 1. Clone and configure

~~~sh
git clone https://github.com/psodage/MLA-EOffice.git
cd MLA-EOffice
~~~

Create `api/.env` from [api/.env.example](api/.env.example) and `web/.env` from [web/.env.example](web/.env.example). Supply your local database, authentication, and API-origin configuration using those templates.

### 2. Start the API

From `api/`:

~~~sh
npm install
npm run db:migrate
npm run dev
~~~

Use a dedicated development database. To inspect applied migrations, run `npm run db:migrate:status`. Development seeds are available through `npm run db:seed:all`; review them before applying them to your database.

### 3. Start the web application

In a second terminal, from `web/`:

~~~sh
npm install
npm run dev
~~~

Open the URL printed by Vite and ensure the configured API origin points to your running backend.

## Commands

| Directory | Command | Purpose |
| --- | --- | --- |
| `api` | `npm run dev` | Development server with nodemon |
| `api` | `npm start` | Start the API with Node.js |
| `api` | `npm run db:migrate` | Apply development migrations |
| `api` | `npm run db:migrate:status` | Inspect migration status |
| `api` | `npm run db:seed:all` | Apply seed data |
| `web` | `npm run dev` | Start Vite |
| `web` | `npm run build` | Build frontend assets |
| `web` | `npm run preview` | Preview a frontend build |
| `web` | `npm run lint` | Run Oxlint |

Production-specific migration and seed scripts are defined in `api/package.json`. Review the selected environment and database before running them. For containers, inspect `docker-compose.yml` and the application Dockerfiles for service configuration.

## Functional review

After setup, check frontend-to-API connectivity and exercise the office workflows relevant to your installation. Verify that language switching updates both interface labels and displayed content, especially records represented by the sample data.

Frontend linting and builds are useful checks, but neither application manifest currently defines an automated test command. This README does not claim a verified live deployment or completed end-to-end test coverage.

## Configuration and deployment

Keep environment-specific credentials outside source control. Configure the web application's API origin, database connection, authentication secrets, and allowed frontend origins for the deployment environment. Review sample records and templates before using them with real office data.
