# Aura CRM - Fullstack Application

A modern CRM (Customer Relationship Management) system built with TypeScript, React, and Node.js. This application helps organizations manage their sales pipeline, contacts, and deals.

## Project Structure

The project is organized as a monorepo with two main directories:

- `frontend/`: React application built with Vite, TypeScript, and TailwindCSS
- `backend/`: Node.js API built with Express, TypeScript, TypeORM, and PostgreSQL

## Features

- **Authentication**: User registration and login with JWT
- **Organizations**: Multi-organization support
- **Contacts**: Contact management system
- **Workflows**: Customizable sales pipeline workflows with stages
- **Deals**: Deal tracking through different pipeline stages

## Prerequisites

- Node.js (v18 or higher)
- pnpm (package manager)
- PostgreSQL database

## Environment Setup

### Backend Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```
PORT=4000
JWT_SECRET=your-secret-key-change-in-production
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=fullstack_db
NODE_ENV=development
```

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd aura-fullstack-test
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up the database:

Make sure PostgreSQL is running and create a database named `fullstack_db` (or the name specified in your environment variables).

4. Run database migrations:

```bash
cd backend
pnpm migration:run
```

## Development

To run both frontend and backend in development mode:

```bash
pnpm dev
```

To run only the frontend:

```bash
pnpm dev:frontend
```

To run only the backend:

```bash
pnpm dev:backend
```

The frontend will be available at: http://localhost:5173
The backend will be available at: http://localhost:4000

## Testing

Run tests for both frontend and backend:

```bash
pnpm test
```

Run tests for frontend only:

```bash
pnpm test:frontend
```

Run tests for backend only:

```bash
pnpm test:backend
```

## Building for Production

Build both frontend and backend:

```bash
pnpm build
```

## Tech Stack

### Frontend
- React 18
- TypeScript
- React Router
- TailwindCSS
- Vite (build tool)
- Vitest (testing)

### Backend
- Node.js
- Express
- TypeScript
- TypeORM (database ORM)
- PostgreSQL
- JWT Authentication
- Bcrypt (password hashing)

## Architecture

The backend follows a clean architecture approach with:

- **Domain Layer**: Core business logic and interfaces
- **Application Layer**: Use cases that orchestrate domain objects
- **Infrastructure Layer**: Implementation details (database, authentication)
- **HTTP Layer**: Controllers and routes

The frontend uses a component-based architecture with:
- Context API for state management
- Service modules for API communication
- React Router for navigation

## API Endpoints

- **Auth**: `/api/auth/register`, `/api/auth/login`
- **Users**: `/api/users`
- **Organizations**: `/api/organizations`
- **Contacts**: `/api/contacts`
- **Workflows**: `/api/workflows`
- **Deals**: `/api/deals`
- **Health Check**: `/api/health`
