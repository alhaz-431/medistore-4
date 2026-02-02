# MediStore Backend 🏥

A robust drug shop management system built with Node.js, Express, Prisma, and PostgreSQL.

## Features
- User Authentication (JWT & Bcrypt)
- Medicine Management API
- Order Placement System
- Database Relations (Users, Medicines, Categories, Orders)

## How to Run Locally
1. Clone the repo: `git clone <repo-link>`
2. Install dependencies: `npm install`
3. Set up `.env` with your `DATABASE_URL` and `JWT_SECRET`.
4. Run Migrations: `npx prisma migrate dev`
5. Start Server: `npm run dev`
