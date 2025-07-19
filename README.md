# TickPath - Modern Ticketing System

TickPath is a modern, full-stack ticketing system built with React and TypeScript. It provides a comprehensive solution for issue tracking, user management, and project organization with real-time collaboration features.

## 🚀 Tech Stack

### Frontend

- **[React 19](https://react.dev/)** - UI library with latest features
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[TanStack Router](https://tanstack.com/router)** - Type-safe routing with file-based routing
- **[TanStack Start](https://tanstack.com/start)** - Full-stack React framework
- **[TanStack Query](https://tanstack.com/query)** - Server state management
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Re-usable component library
- **[Lucide React](https://lucide.dev/)** - Beautiful icons
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications

### Backend & Data

- **[ORPC](https://orpc.dev/)** - Type-safe API layer
- **[Drizzle ORM](https://orm.drizzle.team/)** - Type-safe SQL ORM
- **[MySQL](https://www.mysql.com/)** - Relational database
- **[Better Auth](https://www.better-auth.com/)** - Authentication solution

### Development Tools

- **[Vite](https://vitejs.dev/)** - Build tool and development server
- **[pnpm](https://pnpm.io/)** - Fast, disk space efficient package manager
- **[Docker](https://www.docker.com/)** - Containerization for database
- **[@t3-oss/env-core](https://env.t3.gg/)** - Environment variable validation

## 📁 Project Structure

```
tickpath/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── issue/          # Issue-specific components
│   │   ├── layout/         # Layout components
│   │   └── ui/             # shadcn/ui components
│   ├── db/                 # Database related files
│   │   ├── schema.ts       # Database schema definitions
│   │   ├── db.ts           # Database connection
│   │   ├── drizzle.config.ts # Drizzle configuration
│   │   └── seed.ts         # Database seeding
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries
│   │   ├── auth.ts         # Authentication configuration
│   │   ├── env.ts          # Environment variables
│   │   ├── theme.ts        # Theme management
│   │   └── utils.ts        # Utility functions
│   ├── orpc/               # API layer
│   │   ├── router.ts       # API route definitions
│   │   └── react-query.ts  # Query client setup
│   ├── routes/             # File-based routes
│   │   ├── __root.tsx      # Root layout
│   │   ├── index.tsx       # Home page
│   │   └── api/            # API routes
│   ├── styles/             # Global styles
│   └── routeTree.gen.ts    # Generated route tree
├── docker-compose.yml      # Docker services
├── package.json            # Dependencies and scripts
├── vite.config.ts          # Vite configuration
└── tsconfig.json           # TypeScript configuration
```

### Key Directories Explained

- **`src/components/`** - Contains all reusable React components
  - `issue/` - Components specific to issue management (assignee selector, status icons, etc.)
  - `layout/` - Application layout components (sidebar, navigation)
  - `ui/` - Base UI components from shadcn/ui
- **`src/db/`** - Database layer with Drizzle ORM
- **`src/routes/`** - File-based routing structure
- **`src/orpc/`** - Type-safe API layer using ORPC

## 🛠️ Features

### Issue Management

- ✅ Create, read, update, and delete issues
- ✅ Issue status management (e.g., Todo, In Progress, Done)
- ✅ Priority levels (e.g., Low, Medium, High, Critical)
- ✅ Label/tag system for categorization
- ✅ User assignment and reassignment
- ✅ Issue descriptions and titles

### User Management

- ✅ User authentication and authorization
- ✅ Role-based access control
- ✅ User presence indicators (online, away, offline)
- ✅ User profiles with avatars

### Real-time Features

- ✅ Live user presence status
- ✅ Real-time updates via TanStack Query

### UI/UX

- ✅ Dark/light theme support
- ✅ Responsive design
- ✅ Toast notifications
- ✅ Loading states and error handling
- ✅ Type-safe navigation

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **pnpm** (recommended package manager)
- **Docker** (for running MySQL database)
- **Git**

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd tickpath
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Configure the following environment variables:

```env
# Database
DATABASE_URL="mysql://root:root_password@localhost:3306/demo"

# Authentication
BETTER_AUTH_URL="http://localhost:3000"
BETTER_AUTH_SECRET="your-secret-key-min-10-chars"
```

### 4. Start the Database

Run MySQL using Docker:

```bash
docker-compose up -d
```

This will start a MySQL database on port 3306 with:

- Database: `demo`
- Username: `root`
- Password: `root_password`

### 5. Database Setup

Push the database schema:

```bash
pnpm run db:push
```

Seed the database with initial data:

```bash
pnpm run db:seed
```

### 6. Start the Development Server

```bash
pnpm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## 📜 Available Scripts

### Development

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production

### Database Management

- `pnpm run db:push` - Push schema changes to database
- `pnpm run db:generate` - Generate migration files
- `pnpm run db:reset` - Reset database schema
- `pnpm run db:studio` - Open Drizzle Studio (database GUI)
- `pnpm run db:seed` - Seed database with sample data

### Authentication

- `pnpm run auth:generate` - Generate Better Auth files

## 🗄️ Database Schema

The application uses the following main entities:

### Core Entities

- **Users** - User accounts with authentication
- **Issues** - Main ticketing entities
- **Statuses** - Issue status types (Todo, In Progress, Done, etc.)
- **Priorities** - Issue priority levels
- **Labels** - Categorization tags for issues

### Supporting Entities

- **Sessions** - User authentication sessions
- **Accounts** - OAuth account linking
- **User Presence** - Real-time user status
- **User Roles** - Role-based permissions

### Relationships

- Issues belong to statuses and priorities
- Issues can be assigned to users
- Issues can have multiple labels (many-to-many)
- Users can have multiple roles (many-to-many)

## 🎨 UI Components

The project uses **shadcn/ui** components which provide:

- Consistent design system
- Accessibility features
- Dark/light theme support
- Customizable styling with Tailwind CSS

Key components include:

- `Button`, `Input`, `Dialog` - Basic form elements
- `Sidebar`, `Sheet` - Layout components
- `Avatar`, `Badge` - User interface elements
- `Command`, `Popover` - Interactive components

## 🔧 Configuration Files

### Core Configuration

- **`vite.config.ts`** - Vite bundler configuration with TanStack Start
- **`tsconfig.json`** - TypeScript compiler options
- **`components.json`** - shadcn/ui component configuration
- **`tailwind.config.ts`** - Tailwind CSS configuration (if exists)

### Database Configuration

- **`src/db/drizzle.config.ts`** - Drizzle ORM configuration
- **`docker-compose.yml`** - MySQL database container setup

## 🔐 Authentication

The application uses **Better Auth** for authentication, which provides:

- Session-based authentication
- OAuth provider support
- Email verification
- Password reset functionality
- Role-based access control

Authentication configuration is located in `src/lib/auth.ts`.

## 🌐 API Routes

The application uses **ORPC** for type-safe API routes:

### Available Endpoints

- **Issues** - CRUD operations for issues
- **Statuses** - Retrieve all issue statuses
- **Priorities** - Retrieve all priority levels
- **Labels** - Retrieve all labels
- **Users** - User management with presence status

API routes are defined in `src/orpc/router.ts` and automatically provide:

- Full TypeScript type safety
- Input validation with Zod
- Automatic serialization

## 🎯 Development Guidelines

### Code Organization

- Use TypeScript for all new code
- Follow the established folder structure
- Components should be small and focused
- Use custom hooks for reusable logic

### Database

- Use Drizzle ORM for all database operations
- Define relationships in schema files
- Use migrations for schema changes
- Always validate input with Zod schemas

### Routing

- Use file-based routing (TanStack Router)
- Define loaders for data fetching
- Use type-safe navigation
- Implement proper error boundaries

### Styling

- Use Tailwind CSS for styling
- Leverage shadcn/ui components
- Maintain design system consistency
- Support dark/light themes

## 🚀 Deployment

### Production Build

```bash
pnpm run build
```

### Environment Variables

Ensure all environment variables are properly set in your production environment:

- `DATABASE_URL` - Production database connection
- `BETTER_AUTH_URL` - Production app URL
- `BETTER_AUTH_SECRET` - Secure secret key

### Database Migration

Before deploying, ensure your database schema is up to date:

```bash
pnpm run db:push
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Additional Resources

- [TanStack Router Documentation](https://tanstack.com/router)
- [TanStack Start Documentation](https://tanstack.com/start)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Better Auth Documentation](https://www.better-auth.com/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [ORPC Documentation](https://orpc.dev/)

## 📄 License

This project is licensed under the ISC License.
