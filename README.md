# FinSight - Personal Finance Tracker

FinSight is a responsive, full-stack personal finance tracker web application that provides users with a clean, intuitive UI to manage their financial transactions and view visual insights.

## Features

- Add, edit, delete transactions (amount, date, description)
- View a list of all transactions
- Monthly expense bar chart visualization
- Form validation for transaction fields
- Responsive design with elegant UI
- Optimized performance with Redis caching

## Tech Stack

**Frontend:**
- Next.js (App Router)
- Tailwind CSS
- shadcn/ui components
- Recharts for data visualization

**Backend:**
- Next.js API routes
- Prisma ORM
- PostgreSQL (Docker containerized)
- Redis (caching layer)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Docker and Docker Compose installed
- Git installed

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/finsight.git
cd finsight
```

2. Install dependencies:
```bash
npm install
```

3. Run the setup script to start Docker containers and initialize the database:
```bash
# For Windows PowerShell
npm run setup
# or for bash
bash setup.sh
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Working with the Database

- To view and edit the database directly, run:
```bash
npm run db:studio
```

- If you make changes to the Prisma schema, apply them with:
```bash
npm run db:push
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
