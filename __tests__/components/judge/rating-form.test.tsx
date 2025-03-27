import React from 'react';
import { render, screen } from '@testing-library/react';
import { RatingForm } from '@/components/judge/rating-form';

// Mock the hooks and API
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}), { virtual: true });

jest.mock('@/lib/mock-data', () => ({
  mockAPI: {
    getCriteriaByEventId: jest.fn().mockResolvedValue([
      {
        id: 'criteria-1',
        name: 'Innovation',
        description: 'How innovative is the solution?',
        maxScore: 10,
        weight: 1,
        eventId: 'event-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]),
    createRating: jest.fn().mockResolvedValue({ id: 'rating-1' }),
    updateRating: jest.fn().mockResolvedValue({ id: 'rating-1' }),
    getRatingsByJudgeId: jest.fn().mockResolvedValue([]),
    getRatingsByProjectId: jest.fn().mockResolvedValue([]),
  },
}));

describe('RatingForm', () => {
  const mockProject = {
    id: 'project-1',
    name: 'Test Project',
    description: 'This is a test project',
    teamName: 'Test Team',
    eventId: 'event-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockJudgeId = 'judge-1';

  test('renders the form', () => {
    render(
      <RatingForm 
        project={mockProject} 
        judgeId={mockJudgeId} 
        onSubmitSuccess={jest.fn()} 
      />
    );

    // Check that loading state is initially displayed
    expect(screen.getByText(/loading criteria/i)).toBeInTheDocument();
  });
});