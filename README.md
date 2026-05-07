# Booking Lanka

Booking Lanka is an AI-integrated travel and hotel booking platform built with a React frontend and a Node.js/Express backend.

The system combines destination discovery, AI-assisted itinerary planning, hotel booking workflows, payment status handling, role-based access, and analytics dashboards for admins and property owners.

## Project Highlights

- Secure user signup/login with JWT-based authentication
- Role-based access for User, Manager, and Admin portals
- Smart search and filtering for destinations and stays
- AI-driven trip planning with custom itinerary generation
- Booking cart and end-to-end reservation flow
- Payment confirmation and booking status tracking
- Booking confirmation email support
- Admin and manager dashboards with income/revenue analytics

## Tech Stack

- Frontend: React, Vite, React Router, Bootstrap, Recharts
- Backend: Node.js, Express
- Database/ORM: Prisma
- Auth/Security: JWT, bcrypt, helmet, rate limiting
- Utilities: Nodemailer, Zod

## Repository Structure

```text
.
├─ client/   # Frontend (React + Vite)
├─ server/   # Backend API (Express + Prisma)
├─ docs/     # Supporting docs and project notes
└─ README.md
```

## Local Setup

## 1) Clone repository

```bash
git clone https://github.com/AugustineNishanhta/Bookinglanka.git
cd Bookinglanka
```

## 2) Setup backend

```bash
cd server
npm install
```

Create your environment variables in `server/.env` (based on your project settings), then run:

```bash
npm run prisma:generate
npm run dev
```

Backend default script:

- `npm run dev` -> starts API using nodemon

## 3) Setup frontend

Open a new terminal:

```bash
cd client
npm install
npm run dev
```

Frontend default script:

- `npm run dev` -> starts Vite development server

## Useful Scripts

### Client

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run preview`

### Server

- `npm run dev`
- `npm run start`
- `npm run prisma:generate`
- `npm run prisma:migrate`
- `npm run prisma:deploy`
- `npm run prisma:seed`

## Notes

- This repository includes both source code and project guide files used for academic submission.
- Configure required API keys and SMTP credentials in backend environment variables before running production features.

## Author

Augustine Nishantha  
GitHub: https://github.com/AugustineNishanhta

