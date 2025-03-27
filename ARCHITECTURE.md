# Hackathon Judging Application - Architecture

## System Architecture

### Overview
The Hackathon Judging application follows a modern web application architecture with a clear separation between frontend and backend components. The system is designed to be responsive, secure, and capable of offline operation.

### Technology Stack

#### Frontend
- **Framework**: Next.js (React-based framework)
- **UI Components**: Shadcn UI (based on Radix UI)
- **State Management**: React Context API / React Query
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form with Zod validation
- **Data Fetching**: Fetch API / Axios with React Query
- **Offline Support**: IndexedDB / localStorage

#### Backend
- **API Framework**: Node.js with Express or Next.js API routes
- **Authentication**: JWT-based authentication
- **Database**: PostgreSQL or MongoDB
- **ORM/ODM**: Prisma (SQL) or Mongoose (MongoDB)
- **Caching**: Redis (optional for performance)
- **File Storage**: AWS S3 or similar cloud storage (if needed)

### Data Models

#### User
```
{
  id: UUID,
  name: String,
  email: String,
  password: String (hashed),
  role: Enum ['admin', 'judge'],
  status: Enum ['active', 'inactive', 'pending'],
  createdAt: DateTime,
  updatedAt: DateTime
}
```

#### Event
```
{
  id: UUID,
  name: String,
  description: String,
  startDate: DateTime,
  endDate: DateTime,
  status: Enum ['upcoming', 'active', 'completed'],
  createdBy: UUID (User reference),
  createdAt: DateTime,
  updatedAt: DateTime
}
```

#### Project
```
{
  id: UUID,
  name: String,
  description: String,
  teamName: String,
  eventId: UUID (Event reference),
  createdAt: DateTime,
  updatedAt: DateTime
}
```

#### JudgingCriteria
```
{
  id: UUID,
  name: String,
  description: String,
  maxScore: Number,
  weight: Number,
  eventId: UUID (Event reference),
  createdAt: DateTime,
  updatedAt: DateTime
}
```

#### Rating
```
{
  id: UUID,
  score: Number,
  comment: String,
  judgeId: UUID (User reference),
  projectId: UUID (Project reference),
  criteriaId: UUID (JudgingCriteria reference),
  eventId: UUID (Event reference),
  createdAt: DateTime,
  updatedAt: DateTime
}
```

#### EventParticipation
```
{
  id: UUID,
  userId: UUID (User reference),
  eventId: UUID (Event reference),
  status: Enum ['pending', 'approved', 'rejected'],
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/reset-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password with token

#### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin only)
- `PUT /api/users/:id/role` - Update user role (admin only)

#### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create new event (admin only)
- `PUT /api/events/:id` - Update event (admin only)
- `DELETE /api/events/:id` - Delete event (admin only)
- `PUT /api/events/:id/status` - Update event status (admin only)

#### Projects
- `GET /api/events/:eventId/projects` - Get all projects for an event
- `GET /api/projects/:id` - Get project by ID
- `POST /api/events/:eventId/projects` - Create new project (admin only)
- `PUT /api/projects/:id` - Update project (admin only)
- `DELETE /api/projects/:id` - Delete project (admin only)

#### Judging Criteria
- `GET /api/events/:eventId/criteria` - Get all criteria for an event
- `POST /api/events/:eventId/criteria` - Create new criterion (admin only)
- `PUT /api/criteria/:id` - Update criterion (admin only)
- `DELETE /api/criteria/:id` - Delete criterion (admin only)

#### Ratings
- `GET /api/events/:eventId/ratings` - Get all ratings for an event (admin only)
- `GET /api/users/:userId/ratings` - Get all ratings by a judge
- `GET /api/projects/:projectId/ratings` - Get all ratings for a project
- `POST /api/projects/:projectId/ratings` - Submit rating for a project
- `PUT /api/ratings/:id` - Update rating
- `DELETE /api/ratings/:id` - Delete rating

#### Event Participation
- `GET /api/events/:eventId/participants` - Get all participants for an event
- `POST /api/events/:eventId/participants` - Request to join an event
- `PUT /api/events/:eventId/participants/:userId` - Update participation status (admin only)

### Authentication Flow

1. **Registration**:
   - User submits registration form
   - Backend validates input and creates user with 'pending' status
   - Admin approves user (for judges)
   - Email notification sent to user

2. **Login**:
   - User submits credentials
   - Backend validates and issues JWT token
   - Frontend stores token in localStorage/cookies
   - Token used for subsequent API requests

3. **Authorization**:
   - JWT token validated on each API request
   - Role-based access control enforced
   - Admin-only endpoints protected

### Offline Support Strategy

1. **Data Caching**:
   - Essential data cached in IndexedDB
   - Event and project details stored locally
   - Judging criteria cached for offline access

2. **Offline Submissions**:
   - Ratings stored locally when offline
   - Background sync when connection restored
   - Conflict resolution for overlapping submissions

3. **Progressive Enhancement**:
   - Core functionality works without network
   - Enhanced features available when online
   - Clear UI indicators for offline mode

### Score Calculation Algorithm

1. **Raw Score Collection**:
   - Judges submit ratings (1-10) for each criterion
   - Each project receives multiple ratings across criteria

2. **Normalization Process**:
   - Calculate mean (μ) and standard deviation (σ) for each judge's ratings
   - Convert each rating to z-score: z = (X - μ) / σ
   - This adjusts for judges who consistently rate high or low

3. **Aggregation**:
   - Sum normalized scores across all judges for each project
   - Apply criterion weights if configured
   - Calculate final score and ranking

### Security Considerations

1. **Authentication & Authorization**:
   - JWT with appropriate expiration
   - HTTPS enforcement
   - Role-based access control
   - CSRF protection

2. **Data Protection**:
   - Input validation and sanitization
   - Parameterized queries to prevent SQL injection
   - XSS protection
   - Rate limiting on authentication endpoints

3. **Sensitive Data Handling**:
   - Password hashing with bcrypt
   - Secure storage of sensitive information
   - Minimal exposure of personal data

### Deployment Architecture

1. **Development Environment**:
   - Local development with hot reloading
   - Mock API for frontend development
   - Local database for testing

2. **Staging Environment**:
   - Cloud-based deployment
   - Automated testing
   - Similar to production but isolated

3. **Production Environment**:
   - Containerized deployment (Docker)
   - Load balancing for scalability
   - Database replication/clustering
   - CDN for static assets
   - Monitoring and logging

### Monitoring & Logging

1. **Application Monitoring**:
   - Performance metrics
   - Error tracking
   - User activity monitoring

2. **Logging Strategy**:
   - Structured logging
   - Different log levels (info, warn, error)
   - Sensitive data redaction

3. **Alerting**:
   - Critical error notifications
   - Performance degradation alerts
   - Security incident alerts