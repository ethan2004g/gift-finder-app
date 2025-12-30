# Gift Finder SaaS

A web application that helps users discover personalized gift ideas by analyzing recipient descriptions and providing curated shopping links from multiple ecommerce platforms.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: PostgreSQL (via Prisma ORM)
- **Cache**: Redis
- **Authentication**: NextAuth.js (to be configured)

## Prerequisites

- Node.js 18+
- Docker Desktop (for PostgreSQL and Redis)
- Git

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your API keys and configuration.

### 3. Start Docker Services

```bash
docker-compose up -d
```

This will start PostgreSQL and Redis containers.

### 4. Set Up Database

```bash
# Run Prisma migrations
npx prisma migrate dev

# (Optional) Seed the database
npx prisma db seed
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
gift-finder-app/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Dashboard routes
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # Layout components
│   ├── search/           # Search-related components
│   ├── products/         # Product components
│   └── shared/           # Shared components
├── lib/                   # Utility libraries
│   ├── api/              # API clients
│   ├── adapters/         # Data adapters
│   └── utils/            # Utility functions
├── types/                 # TypeScript type definitions
├── prisma/                # Prisma schema and migrations
└── public/                # Static assets
```

## Development Phases

- **Phase 0**: Setup & Planning ✅ (Current)
- **Phase 1**: Core Infrastructure
- **Phase 2**: Search & AI Integration
- **Phase 3**: Ecommerce API Integrations
- **Phase 4**: Frontend - Core Pages
- **Phase 5**: Tag System
- **Phase 6**: User Features
- **Phase 7**: Custom Sites Feature
- **Phase 8**: Polish & Optimization
- **Phase 9**: Testing
- **Phase 10**: Documentation & Deployment Prep

## API Accounts Required

Before development, you'll need to sign up for:

1. **OpenAI** - For AI-powered recommendations
2. **Amazon Associates** - For Amazon product API
3. **RapidAPI** - For additional product APIs

See `scope.md` for detailed setup instructions.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
