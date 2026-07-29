# ImpalaEd — Learning Management System

ImpalaEd is a full-stack learning management platform built with a **Node.js/Express/Prisma** backend and a **React/TypeScript/Vite** frontend.

## Getting Started

### Prerequisites

- **Node.js** v18+
- **PostgreSQL** running locally on port 5432
- **npm** or **yarn**

### Quick Start

```bash
# 1. Start the backend
cd backend
cp .env.example .env        # configure your database URL
npm install
npx prisma migrate dev
npm run dev

# 2. In a separate terminal, start the frontend
cd frontend
npm install
npm run dev
```

The API runs at `http://localhost:5000` and the frontend at `http://localhost:5173`.

---

## How to Use These READMEs

This repository contains **three README files** at different levels:

| File | What it covers |
|------|---------------|
| [`README.md`](./README.md) *(this file)* | Project overview, links to sub-readmes |
| [`backend/README.md`](./backend/README.md) | Backend architecture, API routes, database schema, services |
| [`frontend/README.md`](./frontend/README.md) | Frontend structure, pages, hooks, services, routing |

### Navigation Guide

- **New to the project?** Start with this root README for the big picture.
- **Working on the API or database?** Open [`backend/README.md`](./backend/README.md) for route tables, schema docs, and service descriptions.
- **Working on the UI or user flows?** Open [`frontend/README.md`](./frontend/README.md) for page maps, hook references, and component guides.

Each sub-README is self-contained so you can jump directly to the one you need.
