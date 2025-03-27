import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProjectList } from '@/components/judge/project-list';
import { mockAPI } from '@/lib/mock-data';

// Mock the mockAPI
jest.mock('@/lib/mock-data', () => ({
  mockAPI: {
    getProjectsByEventId: jest.fn(),
    getRatingsByJudgeId: jest.fn(),
  },
}));

describe('ProjectList', () => {
  const mockEventId = 'event-1';
  const mockJudgeId = 'judge-1';
  
  const mockProjects = [
    {
      id: 'project-1',
      name: 'Test Project 1',
      description: 'This is test project 1',
      teamName: 'Team 1',
      eventId: mockEventId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'project-2',
      name: 'Test Project 2',
      description: 'This is test project 2',
      teamName: 'Team 2',
      eventId: mockEventId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockRatings = [
    {
      id: 'rating-1',
      score: 8,
      comment: 'Good project',
      judgeId: mockJudgeId,
      projectId: 'project-1',
      criteriaId: 'criteria-1',
      eventId: mockEventId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (mockAPI.getProjectsByEventId as jest.Mock).mockResolvedValue(mockProjects);
    (mockAPI.getRatingsByJudgeId as jest.Mock).mockResolvedValue(mockRatings);
  });

  test('renders a list of projects', async () => {
    await act(async () => {
      render(
        <ProjectList 
          eventId={mockEventId} 
          judgeId={mockJudgeId} 
          onSelectProject={jest.fn()} 
        />
      );
    });

    // Wait for projects to load
    await waitFor(() => {
      expect(mockAPI.getProjectsByEventId).toHaveBeenCalledWith(mockEventId);
      expect(mockAPI.getRatingsByJudgeId).toHaveBeenCalledWith(mockJudgeId);
    });

    // Check that projects are displayed
    expect(screen.getByText('Test Project 1')).toBeInTheDocument();
    expect(screen.getByText(/Team: Team 1/)).toBeInTheDocument();
    expect(screen.getByText('Test Project 2')).toBeInTheDocument();
    expect(screen.getByText(/Team: Team 2/)).toBeInTheDocument();
  });

  test('indicates which projects have been rated', async () => {
    await act(async () => {
      render(
        <ProjectList 
          eventId={mockEventId} 
          judgeId={mockJudgeId} 
          onSelectProject={jest.fn()} 
        />
      );
    });

    // Wait for projects and ratings to load
    await waitFor(() => {
      expect(mockAPI.getProjectsByEventId).toHaveBeenCalledWith(mockEventId);
      expect(mockAPI.getRatingsByJudgeId).toHaveBeenCalledWith(mockJudgeId);
    });

    // Check that the first project is marked as rated
    expect(screen.getByText('Rated')).toBeInTheDocument();
    
    // Check that the second project is not marked as rated
    expect(screen.getByText('Not Rated')).toBeInTheDocument();
  });

  test('calls onSelectProject when a project is clicked', async () => {
    const onSelectProject = jest.fn();
    
    await act(async () => {
      render(
        <ProjectList 
          eventId={mockEventId} 
          judgeId={mockJudgeId} 
          onSelectProject={onSelectProject} 
        />
      );
    });

    // Wait for projects to load
    await waitFor(() => {
      expect(mockAPI.getProjectsByEventId).toHaveBeenCalledWith(mockEventId);
    });

    // Find the first project card and click it
    const projectCards = screen.getAllByText(/Test Project/);
    await userEvent.click(projectCards[0]);

    // Check that onSelectProject was called with the correct project
    expect(onSelectProject).toHaveBeenCalled();
  });

  test('displays a message when no projects are available', async () => {
    (mockAPI.getProjectsByEventId as jest.Mock).mockResolvedValue([]);
    
    await act(async () => {
      render(
        <ProjectList 
          eventId={mockEventId} 
          judgeId={mockJudgeId} 
          onSelectProject={jest.fn()} 
        />
      );
    });

    // Wait for projects to load
    await waitFor(() => {
      expect(mockAPI.getProjectsByEventId).toHaveBeenCalledWith(mockEventId);
    });

    // Check that a no projects message is displayed
    expect(screen.getByText(/no projects available/i)).toBeInTheDocument();
  });

  test('displays loading state while fetching projects', () => {
    render(
      <ProjectList 
        eventId={mockEventId} 
        judgeId={mockJudgeId} 
        onSelectProject={jest.fn()} 
      />
    );

    // Check that loading state is displayed
    expect(screen.getByText(/loading projects/i)).toBeInTheDocument();
  });
});