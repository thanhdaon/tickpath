# TickPath Development Guide

This document provides detailed information for developers working on the TickPath project, including architectural decisions, coding standards, and advanced development workflows.

## 🏗️ Architecture Overview

### Full-Stack Architecture

TickPath follows a modern full-stack architecture using TanStack Start, which provides:

- **Server-Side Rendering (SSR)** - Pages are rendered on the server for better SEO and initial load performance
- **Client-Side Hydration** - Interactive features are hydrated on the client
- **Type-Safe API** - End-to-end type safety from database to UI
- **File-Based Routing** - Intuitive routing structure using the filesystem

### Data Flow

```
User Input → TanStack Query → ORPC → Drizzle ORM → MySQL
                ↓
React Components ← TanStack Query ← ORPC Response ← Database
```

1. **User interactions** trigger API calls through TanStack Query
2. **ORPC handlers** process requests with type safety and validation
3. **Drizzle ORM** provides type-safe database operations
4. **MySQL database** stores and retrieves data
5. **Responses** flow back through the same chain with full type safety

### Key Architectural Decisions

#### 1. TanStack Router over React Router

- **Reason**: Better TypeScript integration, file-based routing, built-in data loading
- **Benefits**: Type-safe navigation, automatic code splitting, better developer experience

#### 2. ORPC over tRPC/REST

- **Reason**: Simpler setup, excellent TypeScript integration, built for React
- **Benefits**: Less boilerplate, automatic type inference, better error handling

#### 3. Drizzle ORM over Prisma

- **Reason**: Better performance, closer to SQL, lightweight
- **Benefits**: More control over queries, better TypeScript support, smaller bundle size

#### 4. Better Auth over NextAuth/Auth0

- **Reason**: Modern architecture, better TypeScript support, more flexible
- **Benefits**: Better session management, easier customization, framework agnostic

## 🗂️ Code Organization

### Component Structure

```typescript
// Component with proper TypeScript and patterns
interface ComponentProps {
  data: SomeType;
  onAction?: (id: string) => void;
}

export function Component({ data, onAction }: ComponentProps) {
  // Hooks at the top
  const [state, setState] = useState();
  const query = useQuery(/* ... */);

  // Event handlers
  const handleClick = useCallback(() => {
    onAction?.(data.id);
  }, [onAction, data.id]);

  // Early returns for loading/error states
  if (query.isLoading) return <LoadingSpinner />;
  if (query.isError) return <ErrorMessage error={query.error} />;

  // Main render
  return <div className="component-root">{/* ... */}</div>;
}
```

### Custom Hooks Pattern

```typescript
// Custom hook for reusable logic
export function useIssueActions() {
  const queryClient = useQueryClient();

  const updateStatus = useMutation({
    mutationFn: orpc.issues.updateStatus.mutate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
    },
  });

  return {
    updateStatus,
    isUpdating: updateStatus.isPending,
  };
}
```

### Database Operations

```typescript
// Always use Drizzle query builder for type safety
export const getAllIssuesWithDetails = async () => {
  return await db.query.issue.findMany({
    with: {
      status: true,
      priority: true,
      assignee: {
        columns: {
          id: true,
          name: true,
          image: true,
        },
      },
      labels: {
        with: {
          label: true,
        },
      },
    },
  });
};
```

## 🎯 Coding Standards

### TypeScript Guidelines

1. **Always use explicit types for public APIs**

   ```typescript
   // Good
   interface CreateIssueInput {
     title: string;
     description?: string;
     statusId: string;
   }

   // Avoid
   function createIssue(data: any) { ... }
   ```

2. **Use type-safe database operations**

   ```typescript
   // Good
   const issue = await db.query.issue.findFirst({
     where: eq(issue.id, issueId),
   });

   // Avoid
   const issue = await db.execute(
     sql`SELECT * FROM issue WHERE id = ${issueId}`
   );
   ```

3. **Prefer union types over enums**

   ```typescript
   // Good
   type IssueStatus = 'todo' | 'in_progress' | 'done';

   // Avoid (unless really needed)
   enum IssueStatus { ... }
   ```

### React Guidelines

1. **Use functional components with hooks**
2. **Prefer composition over inheritance**
3. **Extract complex logic into custom hooks**
4. **Use React.memo() for expensive components**
5. **Always handle loading and error states**

### CSS/Styling Guidelines

1. **Use Tailwind utility classes**

   ```tsx
   <div className="flex items-center gap-2 p-4 bg-background border rounded-lg">
   ```

2. **Use CSS variables for theming**

   ```css
   .custom-component {
     color: hsl(var(--foreground));
     background: hsl(var(--background));
   }
   ```

3. **Follow shadcn/ui patterns for custom components**

## 🔄 Development Workflow

### Feature Development Process

1. **Create feature branch from main**

   ```bash
   git checkout -b feature/issue-filtering
   ```

2. **Database changes (if needed)**

   ```bash
   # Modify schema in src/db/schema.ts
   pnpm run db:generate  # Generate migration
   pnpm run db:push      # Apply to dev database
   ```

3. **Implement backend changes**

   ```bash
   # Add/modify ORPC handlers in src/orpc/router.ts
   # Ensure type safety and input validation
   ```

4. **Implement frontend changes**

   ```bash
   # Create/modify components
   # Add/update routes if needed
   # Implement proper error handling
   ```

5. **Test the feature**
   ```bash
   pnpm run dev
   # Manual testing in browser
   # Check responsive design
   # Test error states
   ```

### Database Development

#### Schema Changes

```bash
# 1. Modify schema.ts
# 2. Generate migration
pnpm run db:generate

# 3. Review generated migration
# 4. Apply to database
pnpm run db:push

# 5. Update seed data if needed
pnpm run db:seed
```

#### Using Drizzle Studio

```bash
pnpm run db:studio
```

Opens a web interface to browse and edit database data at `http://localhost:4983`

### API Development

#### Adding New Endpoints

1. **Define the handler**

   ```typescript
   // src/orpc/router.ts
   const createIssue = os
     .input(
       z.object({
         title: z.string().min(1),
         description: z.string().optional(),
         statusId: z.string(),
       })
     )
     .handler(async ({ input }) => {
       return await db.insert(issue).values(input);
     });
   ```

2. **Add to router**

   ```typescript
   export const router = {
     issues: {
       getAll: getAllIssues,
       create: createIssue, // Add new endpoint
     },
   };
   ```

3. **Use in components**
   ```typescript
   const createIssueMutation = useMutation({
     mutationFn: orpc.issues.create.mutate,
   });
   ```

## 🧪 Testing Strategy

### Manual Testing Checklist

- [ ] Feature works in both light and dark themes
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Loading states are shown appropriately
- [ ] Error states are handled gracefully
- [ ] Type safety is maintained end-to-end
- [ ] Database operations work correctly
- [ ] Authentication/authorization works as expected

### Browser Testing

- Chrome (primary development browser)
- Firefox
- Safari (if available)
- Mobile browsers (Chrome/Safari on iOS/Android)

## 🐛 Debugging

### Common Issues and Solutions

#### 1. Database Connection Issues

```bash
# Check if Docker container is running
docker ps

# Restart database
docker-compose down
docker-compose up -d

# Check database connection
pnpm run db:studio
```

#### 2. Type Errors

```bash
# Regenerate route tree if router types are wrong
# This happens after adding new routes
pnpm run dev  # Should auto-regenerate

# Check for TypeScript errors
npx tsc --noEmit
```

#### 3. Build Issues

```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Clear Vite cache
rm -rf .vite
```

### Development Tools

#### VS Code Extensions (Recommended)

- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- Auto Rename Tag

#### Browser DevTools

- React Developer Tools
- TanStack Query DevTools (built-in)
- TanStack Router DevTools (built-in)

## 🚀 Performance Considerations

### Frontend Performance

1. **Code Splitting**

   - TanStack Router automatically code-splits routes
   - Use dynamic imports for heavy components

   ```typescript
   const HeavyComponent = lazy(() => import("./HeavyComponent"));
   ```

2. **Query Optimization**

   - Use proper staleTime and cacheTime
   - Implement optimistic updates where appropriate

   ```typescript
   const { data } = useQuery({
     queryKey: ["issues"],
     queryFn: orpc.issues.getAll.query,
     staleTime: 5 * 60 * 1000, // 5 minutes
   });
   ```

3. **Image Optimization**
   - Use appropriate image formats (WebP when possible)
   - Implement lazy loading for images

### Backend Performance

1. **Database Queries**

   - Use indexes on frequently queried columns
   - Avoid N+1 queries using Drizzle's `with` option

   ```typescript
   const issues = await db.query.issue.findMany({
     with: {
       assignee: true, // Join instead of separate query
     },
   });
   ```

2. **Caching**
   - TanStack Query handles client-side caching
   - Consider server-side caching for expensive operations

## 🔒 Security Guidelines

### Authentication & Authorization

1. **Always validate user permissions**

   ```typescript
   const updateIssue = os
     .input(updateIssueSchema)
     .handler(async ({ input, context }) => {
       // Check if user has permission to update this issue
       if (!canUserUpdateIssue(context.user, input.issueId)) {
         throw new Error("Unauthorized");
       }
       // ... rest of handler
     });
   ```

2. **Input validation with Zod**

   ```typescript
   const schema = z.object({
     title: z.string().min(1).max(100),
     email: z.string().email(),
   });
   ```

3. **Environment variables**
   - Never commit secrets to version control
   - Use environment-specific configurations
   - Validate environment variables with `@t3-oss/env-core`

### Data Protection

1. **Sanitize user inputs**
2. **Use HTTPS in production**
3. **Implement proper session management**
4. **Follow OWASP guidelines**

## 📈 Monitoring & Observability

### Development Monitoring

1. **TanStack Query DevTools** - Monitor API calls and cache
2. **TanStack Router DevTools** - Monitor routing and navigation
3. **Browser Performance Tab** - Monitor rendering performance
4. **Console warnings/errors** - Fix all console output

### Production Considerations

1. **Error Boundaries** - Implement proper error handling
2. **Logging** - Add structured logging for API endpoints
3. **Performance Monitoring** - Consider adding performance monitoring
4. **User Analytics** - Track user interactions (if needed)

## 🔄 Deployment Pipeline

### Pre-deployment Checklist

- [ ] All TypeScript errors resolved
- [ ] Build completes successfully
- [ ] Database migrations applied
- [ ] Environment variables configured
- [ ] Dependencies updated and secure
- [ ] Performance testing completed

### Environment Setup

1. **Development** - Local with Docker database
2. **Staging** - Production-like environment for testing
3. **Production** - Live application

Each environment should have its own:

- Database instance
- Environment variables
- Authentication configuration

---

This development guide should be updated as the project evolves and new patterns emerge. All developers should contribute to keeping this documentation current and comprehensive.
