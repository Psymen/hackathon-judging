import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EventDetailsPage from '@/app/admin/events/[id]/page';
import { mockAPI } from '@/lib/mock-data';

// Mock the components used in the page
jest.mock('@/components/admin-layout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="admin-layout">{children}</div>,
}));

// Mock the Tabs component
jest.mock('@/components/ui/tabs', () => ({
  Tabs: ({ children, defaultValue }: any) => <div data-testid="tabs">{children}</div>,
  TabsList: ({ children }: any) => <div data-testid="tabs-list">{children}</div>,
  TabsTrigger: ({ children, value }: any) => <button data-testid={`tab-${value}`}>{children}</button>,
  TabsContent: ({ children, value }: any) => <div data-testid={`tab-content-${value}`}>{children}</div>,
}));

// Mock the mockAPI
jest.mock('@/lib/mock-data', () => ({
  mockAPI: {
    getEventById: jest.fn(),
    getProjectsByEventId: jest.fn(),
    getCriteriaByEventId: jest.fn(),
    getEventParticipationsByEventId: jest.fn(),
    getUserById: jest.fn(),
    getRatingsByJudgeId: jest.fn(),
    updateEventParticipation: jest.fn(),
  },
}));

// Mock the useToast hook
jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

describe('EventDetailsPage', () => {
  const mockEvent = {
    id: 'event-123',
    name: 'Test Event',
    description: 'This is a test event',
    status: 'active',
    startDate: new Date('2025-06-15'),
    endDate: new Date('2025-06-16'),
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'user-123',
  };
  
  const mockProjects = [
    { id: 'project-1', name: 'Project 1', description: 'Description 1', teamName: 'Team 1', eventId: 'event-123' },
    { id: 'project-2', name: 'Project 2', description: 'Description 2', teamName: 'Team 2', eventId: 'event-123' },
  ];
  
  const mockCriteria = [
    { id: 'criteria-1', name: 'Innovation', description: 'How innovative is the solution?', maxScore: 10, weight: 0.3, eventId: 'event-123' },
    { id: 'criteria-2', name: 'Technical Complexity', description: 'How technically complex is the implementation?', maxScore: 10, weight: 0.3, eventId: 'event-123' },
  ];
  
  const mockParticipations = [
    { id: 'participation-1', userId: 'user-1', eventId: 'event-123', status: 'approved' },
    { id: 'participation-2', userId: 'user-2', eventId: 'event-123', status: 'pending' },
  ];
  
  const mockUsers = {
    'user-1': { id: 'user-1', name: 'Judge 1', email: 'judge1@example.com', role: 'judge' },
    'user-2': { id: 'user-2', name: 'Judge 2', email: 'judge2@example.com', role: 'judge' },
  };
  
  const mockRatings = [
    { id: 'rating-1', judgeId: 'user-1', projectId: 'project-1', eventId: 'event-123', criteriaId: 'criteria-1', score: 8 },
    { id: 'rating-2', judgeId: 'user-1', projectId: 'project-2', eventId: 'event-123', criteriaId: 'criteria-1', score: 7 },
  ];
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock API responses
    (mockAPI.getEventById as jest.Mock).mockResolvedValue(mockEvent);
    (mockAPI.getProjectsByEventId as jest.Mock).mockResolvedValue(mockProjects);
    (mockAPI.getCriteriaByEventId as jest.Mock).mockResolvedValue(mockCriteria);
    (mockAPI.getEventParticipationsByEventId as jest.Mock).mockResolvedValue(mockParticipations);
    (mockAPI.getUserById as jest.Mock).mockImplementation((id) => Promise.resolve(mockUsers[id]));
    (mockAPI.getRatingsByJudgeId as jest.Mock).mockImplementation((id) => {
      if (id === 'user-1') return Promise.resolve(mockRatings);
      return Promise.resolve([]);
    });
    (mockAPI.updateEventParticipation as jest.Mock).mockImplementation((id, data) => 
      Promise.resolve({ ...mockParticipations.find(p => p.id === id), ...data })
    );
  });
  
  test('renders loading state initially', async () => {
    render(<EventDetailsPage params={{ id: 'event-123' }} />);
    
    // Check that loading state is rendered
    expect(screen.getByTestId('admin-layout')).toBeInTheDocument();
    
    // Wait for data to load
    await waitFor(() => {
      expect(mockAPI.getEventById).toHaveBeenCalledWith('event-123');
    });
  });
  
  test('renders event details after loading', async () => {
    render(<EventDetailsPage params={{ id: 'event-123' }} />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(mockAPI.getEventById).toHaveBeenCalledWith('event-123');
    });
    
    // Check that event details are rendered
    await waitFor(() => {
      expect(screen.getByText('Test Event')).toBeInTheDocument();
      expect(screen.getByText('This is a test event')).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
    });
    
    // Check that stats are rendered
    expect(screen.getByText('2')).toBeInTheDocument(); // Total Projects
    expect(screen.getByText('1')).toBeInTheDocument(); // Total Judges (approved)
    
    // Check that tabs are rendered
    expect(screen.getByTestId('tab-results')).toBeInTheDocument();
    expect(screen.getByTestId('tab-judges')).toBeInTheDocument();
  });
  
  test('renders not found state when event does not exist', async () => {
    // Mock getEventById to return null
    (mockAPI.getEventById as jest.Mock).mockResolvedValue(null);
    
    render(<EventDetailsPage params={{ id: 'non-existent-event' }} />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(mockAPI.getEventById).toHaveBeenCalledWith('non-existent-event');
    });
    
    // Check that not found state is rendered
    await waitFor(() => {
      expect(screen.getByText('Event not found')).toBeInTheDocument();
    });
  });
  
  test('handles judge approval', async () => {
    render(<EventDetailsPage params={{ id: 'event-123' }} />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(mockAPI.getEventById).toHaveBeenCalledWith('event-123');
    });
    
    // Find and click the approve button for the pending judge
    const approveButtons = await screen.findAllByText('Approve');
    await userEvent.click(approveButtons[0]);
    
    // Check that updateEventParticipation was called with correct arguments
    await waitFor(() => {
      expect(mockAPI.updateEventParticipation).toHaveBeenCalledWith(
        'participation-2',
        { status: 'approved' }
      );
    });
  });
  
  test('handles judge rejection', async () => {
    render(<EventDetailsPage params={{ id: 'event-123' }} />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(mockAPI.getEventById).toHaveBeenCalledWith('event-123');
    });
    
    // Find and click the decline button for the pending judge
    const declineButtons = await screen.findAllByText('Decline');
    await userEvent.click(declineButtons[0]);
    
    // Check that updateEventParticipation was called with correct arguments
    await waitFor(() => {
      expect(mockAPI.updateEventParticipation).toHaveBeenCalledWith(
        'participation-2',
        { status: 'rejected' }
      );
    });
  });
});