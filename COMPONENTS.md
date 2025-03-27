# Hackathon Judging Application - Component Structure

This document outlines the component structure for the Hackathon Judging application, organized by feature area and interface type.

## Shared Components

### Layout Components
- `RootLayout` - Base layout wrapper for the entire application
- `AdminLayout` - Layout for admin pages with sidebar navigation
- `JudgeLayout` - Layout for judge pages with mobile-optimized navigation

### Authentication Components
- `LoginForm` - Form for user login
- `RegisterForm` - Form for user registration
- `PasswordResetForm` - Form for password reset
- `PasswordResetRequestForm` - Form to request password reset

### UI Components
- `Button` - Reusable button component with variants
- `Card` - Container for content with consistent styling
- `Input` - Form input with validation
- `Select` - Dropdown selection component
- `Checkbox` - Checkbox input component
- `RadioGroup` - Radio button group component
- `Slider` - Slider input for ratings
- `TextArea` - Multi-line text input
- `Alert` - Notification component for success/error messages
- `Modal` - Modal dialog component
- `Tabs` - Tabbed interface component
- `Table` - Data table with sorting and filtering
- `Pagination` - Pagination controls for tables
- `Badge` - Status indicator component
- `Avatar` - User avatar component
- `Dropdown` - Dropdown menu component
- `Toast` - Toast notification component
- `Spinner` - Loading indicator
- `EmptyState` - Component for empty data states
- `ErrorBoundary` - Error handling component

## Admin Interface Components

### Dashboard Components
- `DashboardStats` - Statistics cards for dashboard
- `RecentEventsTable` - Table showing recent events
- `PendingApprovalsTable` - Table showing pending judge approvals
- `ActivityFeed` - Feed of recent activity

### Event Management Components
- `EventList` - List of all events
- `EventCard` - Card displaying event summary
- `EventForm` - Form for creating/editing events
- `EventDetails` - Detailed view of an event
- `EventStatusBadge` - Badge showing event status
- `EventActions` - Action buttons for event management
- `EndJudgingModal` - Modal for ending judging session

### User Management Components
- `UserList` - List of all users
- `UserTable` - Table displaying user information
- `UserForm` - Form for creating/editing users
- `RoleSelector` - Component for changing user roles
- `InviteUserForm` - Form for inviting new users
- `ApprovalActions` - Actions for approving/rejecting judges

### Judging Criteria Components
- `CriteriaList` - List of judging criteria
- `CriteriaForm` - Form for creating/editing criteria
- `CriteriaPreview` - Preview of how criteria will appear to judges
- `CriteriaWeightInput` - Input for setting criteria weights

### Results Components
- `ResultsTable` - Table showing judging results
- `ProjectRankings` - Display of project rankings
- `ScoreChart` - Visualization of scores
- `ExportControls` - Controls for exporting results
- `FilterControls` - Controls for filtering results data
- `JudgeComparisonChart` - Chart comparing judge scoring patterns

## Judge Interface Components

### Event Components
- `JudgeEventList` - List of events available to judge
- `JudgeEventCard` - Card displaying event summary for judges
- `EventJoinRequest` - Component for requesting to join an event
- `EventStatusIndicator` - Indicator showing event status

### Judging Components
- `JudgingInterface` - Main interface for judging projects
- `ProjectNavigation` - Controls for navigating between projects
- `RatingForm` - Form for submitting ratings
- `CriteriaRatingInput` - Input for rating a specific criterion
- `CommentsInput` - Input for additional comments
- `SubmissionStatus` - Indicator showing submission status
- `ProgressIndicator` - Indicator showing judging progress
- `OfflineIndicator` - Indicator showing offline status

### Ratings History Components
- `RatingsHistoryList` - List of previously submitted ratings
- `RatingCard` - Card displaying a submitted rating
- `RatingDetails` - Detailed view of a rating
- `RatingFilter` - Controls for filtering ratings history

## Context Providers

- `AuthProvider` - Authentication context provider
- `ThemeProvider` - Theme context provider
- `NotificationProvider` - Toast notification context provider
- `OfflineProvider` - Offline status context provider

## Hooks

- `useAuth` - Hook for authentication state and methods
- `useUser` - Hook for user data
- `useEvents` - Hook for event data
- `useProjects` - Hook for project data
- `useCriteria` - Hook for criteria data
- `useRatings` - Hook for ratings data
- `useOffline` - Hook for offline status
- `useLocalStorage` - Hook for local storage
- `useForm` - Hook for form handling
- `useMediaQuery` - Hook for responsive design
- `useDebounce` - Hook for debouncing input
- `usePagination` - Hook for pagination logic

## Pages

### Public Pages
- `HomePage` - Landing page
- `LoginPage` - Login page
- `RegisterPage` - Registration page
- `PasswordResetPage` - Password reset page
- `TermsPage` - Terms of service page
- `PrivacyPage` - Privacy policy page

### Admin Pages
- `AdminDashboardPage` - Admin dashboard
- `EventsListPage` - List of all events
- `EventDetailsPage` - Details of a specific event
- `EventEditPage` - Edit event page
- `EventCreatePage` - Create new event page
- `UsersListPage` - List of all users
- `UserDetailsPage` - Details of a specific user
- `UserEditPage` - Edit user page
- `SettingsPage` - Admin settings page
- `ResultsDashboardPage` - Results dashboard

### Judge Pages
- `JudgeEventsPage` - List of events for judges
- `JudgeEventDetailsPage` - Details of a specific event for judges
- `JudgingPage` - Project judging interface
- `RatingsHistoryPage` - History of submitted ratings
- `JudgeProfilePage` - Judge profile page

## Component Organization

The components should be organized in the following directory structure:

```
/components
  /ui                    # Base UI components
  /layout                # Layout components
  /auth                  # Authentication components
  /admin                 # Admin-specific components
    /dashboard
    /events
    /users
    /criteria
    /results
  /judge                 # Judge-specific components
    /events
    /judging
    /ratings
  /shared                # Shared components used by both interfaces
  /providers             # Context providers
  /hooks                 # Custom hooks
```

## Component Implementation Guidelines

1. **Component Composition**
   - Use composition over inheritance
   - Create small, focused components
   - Combine components to build complex interfaces

2. **State Management**
   - Use React Query for server state
   - Use React Context for global UI state
   - Use local state for component-specific state

3. **Styling**
   - Use Tailwind CSS for styling
   - Create consistent design tokens
   - Ensure responsive design for all components

4. **Accessibility**
   - Include proper ARIA attributes
   - Ensure keyboard navigation
   - Maintain sufficient color contrast
   - Test with screen readers

5. **Performance**
   - Use React.memo for expensive renders
   - Implement virtualization for long lists
   - Lazy load components when appropriate
   - Optimize re-renders with useMemo and useCallback

6. **Testing**
   - Write unit tests for all components
   - Create integration tests for key workflows
   - Test responsive behavior
   - Test accessibility compliance