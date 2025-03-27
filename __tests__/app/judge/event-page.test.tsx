import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import JudgeEventPage from '@/app/judge/events/[id]/page';
import { mockAPI } from '@/lib/mock-data';

// Mock the components
jest.mock('@/components/judge-layout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="judge-layout">{children}</div>,
}));

jest.mock('@/components/judge/project-list', () => ({
  ProjectList: ({ onSelectProject }: any) => (
    <div data-testid="project-list">
      <button onClick={() => onSelectProject({
        id: 'project-1',
        name: 'Test Project',
        description: 'Test Description',
        teamName: 'Test Team',
        eventId: 'event-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      })}>
        Select Project
      </button>
    </div>
  ),
}));

jest.mock('@/components/judge/rating-form', () => ({
  RatingForm: ({ project, onSubmitSuccess }: any) => (
    <div data-testid="rating-form">
      <div>Project: {project.name}</div>
      <button onClick={onSubmitSuccess}>Submit Rating</button>
    </div>
  ),
}));

// Mock the mockAPI
jest.mock('@/lib/mock-data', () => ({
  mockAPI: {
    getEventById: jest.fn(),
    getUserById: jest.fn(),
  },
}));

// Mock the auth context
jest.mock('@/lib/auth-context', () => ({
  useAuth: () => ({
    user: { id: 'judge-1', name: 'Test Judge', role: 'judge' },
    loading: false,
  }),
}));

describe('JudgeEventPage', () => {
  const mockEvent = {
    id: 'event-1',
    name: 'Test Event',
    description: 'This is a test event',
    startDate: new Date(),
    endDate: new Date(),
    status: 'active',
    createdBy: 'admin-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (mockAPI.getEventById as jest.Mock).mockResolvedValue(mockEvent);
  });

  test('renders the event details and project list', async () => {
    await act(async () => {
      render(<JudgeEventPage params={{ id: 'event-1' }} />);
    });

    // Wait for event to load
    await waitFor(() => {
      expect(mockAPI.getEventById).toHaveBeenCalledWith('event-1');
    });

    // Check that event details are displayed
    expect(screen.getByText('Test Event')).toBeInTheDocument();
    
    // Check that project list is rendered
    expect(screen.getByTestId('project-list')).toBeInTheDocument();
    
    // Check that rating form is not initially rendered
    expect(screen.queryByTestId('rating-form')).not.toBeInTheDocument();
  });

  test('displays rating form when a project is selected', async () => {
    await act(async () => {
      render(<JudgeEventPage params={{ id: 'event-1' }} />);
    });

    // Wait for event to load
    await waitFor(() => {
      expect(mockAPI.getEventById).toHaveBeenCalledWith('event-1');
    });

    // Select a project
    await act(async () => {
      await userEvent.click(screen.getByText('Select Project'));
    });

    // Check that rating form is rendered with the selected project
    expect(screen.getByTestId('rating-form')).toBeInTheDocument();
    expect(screen.getByText('Project: Test Project')).toBeInTheDocument();
  });

  test('returns to project list after rating submission', async () => {
    await act(async () => {
      render(<JudgeEventPage params={{ id: 'event-1' }} />);
    });

    // Wait for event to load
    await waitFor(() => {
      expect(mockAPI.getEventById).toHaveBeenCalledWith('event-1');
    });

    // Select a project
    await act(async () => {
      await userEvent.click(screen.getByText('Select Project'));
    });

    // Check that rating form is rendered
    expect(screen.getByTestId('rating-form')).toBeInTheDocument();

    // Submit the rating
    await act(async () => {
      await userEvent.click(screen.getByText('Submit Rating'));
    });

    // Check that we're back to the project list
    expect(screen.queryByTestId('rating-form')).not.toBeInTheDocument();
    expect(screen.getByTestId('project-list')).toBeInTheDocument();
  });

  test('displays loading state while fetching event', () => {
    render(<JudgeEventPage params={{ id: 'event-1' }} />);

    // Check that loading state is displayed
    expect(screen.getByText(/loading event/i)).toBeInTheDocument();
  });

  test('displays error message when event is not found', async () => {
    (mockAPI.getEventById as jest.Mock).mockResolvedValue(null);
    
    await act(async () => {
      render(<JudgeEventPage params={{ id: 'invalid-id' }} />);
    });

    // Wait for event to load
    await waitFor(() => {
      expect(mockAPI.getEventById).toHaveBeenCalledWith('invalid-id');
    });

    // Check that error message is displayed
    expect(screen.getByText(/event not found/i)).toBeInTheDocument();
  });
});