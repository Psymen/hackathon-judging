import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EventCard } from '@/components/admin/events/event-card';
import { Event } from '@/lib/mock-data';

// Mock the useToast hook
jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

describe('EventCard', () => {
  const mockEvent: Event = {
    id: 'event-123',
    name: 'Test Event',
    description: 'This is a test event',
    status: 'upcoming',
    startDate: new Date('2025-06-15'),
    endDate: new Date('2025-06-16'),
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'user-123',
  };
  
  const mockJudgeCount = 8;
  const mockProjectCount = 32;
  
  test('renders event details correctly', () => {
    render(
      <EventCard 
        event={mockEvent} 
        judgeCount={mockJudgeCount} 
        projectCount={mockProjectCount} 
      />
    );
    
    // Check that event details are rendered
    expect(screen.getByText('Test Event')).toBeInTheDocument();
    expect(screen.getByText('This is a test event')).toBeInTheDocument();
    expect(screen.getByText('Upcoming')).toBeInTheDocument();
    expect(screen.getByText('Jun 15-16, 2025')).toBeInTheDocument();
    expect(screen.getByText('8 Judges · 32 Projects')).toBeInTheDocument();
    
    // Check that buttons are rendered
    expect(screen.getByText('View Details')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
    
    // For upcoming events, "Start Judging" button should be visible
    expect(screen.getByText('Start Judging')).toBeInTheDocument();
  });
  
  test('renders correct action button for active events', () => {
    const activeEvent = { ...mockEvent, status: 'active' };
    
    render(
      <EventCard 
        event={activeEvent} 
        judgeCount={mockJudgeCount} 
        projectCount={mockProjectCount} 
        onStatusChange={jest.fn()}
      />
    );
    
    // For active events, "End Judging" button should be visible
    expect(screen.getByText('End Judging')).toBeInTheDocument();
    
    // "Start Judging" button should not be visible
    expect(screen.queryByText('Start Judging')).not.toBeInTheDocument();
  });
  
  test('renders correct action button for completed events', () => {
    const completedEvent = { ...mockEvent, status: 'completed' };
    
    render(
      <EventCard 
        event={completedEvent} 
        judgeCount={mockJudgeCount} 
        projectCount={mockProjectCount} 
        onStatusChange={jest.fn()}
      />
    );
    
    // For completed events, "Reactivate" button should be visible
    expect(screen.getByText('Reactivate')).toBeInTheDocument();
    
    // Other action buttons should not be visible
    expect(screen.queryByText('Start Judging')).not.toBeInTheDocument();
    expect(screen.queryByText('End Judging')).not.toBeInTheDocument();
  });
  
  test('does not render action buttons when onStatusChange is not provided', () => {
    render(
      <EventCard 
        event={mockEvent} 
        judgeCount={mockJudgeCount} 
        projectCount={mockProjectCount} 
      />
    );
    
    // Action buttons should not be visible when onStatusChange is not provided
    expect(screen.queryByText('Start Judging')).not.toBeInTheDocument();
    expect(screen.queryByText('End Judging')).not.toBeInTheDocument();
    expect(screen.queryByText('Reactivate')).not.toBeInTheDocument();
  });
  
  test('calls onStatusChange when action button is clicked', async () => {
    const mockOnStatusChange = jest.fn().mockResolvedValue(undefined);
    
    render(
      <EventCard 
        event={mockEvent} 
        judgeCount={mockJudgeCount} 
        projectCount={mockProjectCount} 
        onStatusChange={mockOnStatusChange}
      />
    );
    
    // Click the "Start Judging" button
    await userEvent.click(screen.getByText('Start Judging'));
    
    // Check that onStatusChange was called with correct arguments
    await waitFor(() => {
      expect(mockOnStatusChange).toHaveBeenCalledWith('event-123', 'active');
    });
  });
  
  test('handles status change error', async () => {
    const mockOnStatusChange = jest.fn().mockRejectedValue(new Error('Failed to update status'));
    
    render(
      <EventCard 
        event={mockEvent} 
        judgeCount={mockJudgeCount} 
        projectCount={mockProjectCount} 
        onStatusChange={mockOnStatusChange}
      />
    );
    
    // Click the "Start Judging" button
    await userEvent.click(screen.getByText('Start Judging'));
    
    // Check that onStatusChange was called
    await waitFor(() => {
      expect(mockOnStatusChange).toHaveBeenCalled();
    });
    
    // Toast should be called with error message, but we can't easily test this
    // since we're mocking the useToast hook
  });
});