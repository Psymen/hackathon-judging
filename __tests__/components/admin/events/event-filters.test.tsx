import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EventFilters } from '@/components/admin/events/event-filters';

describe('EventFilters', () => {
  const mockOnFilterChange = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders with default filters', () => {
    render(<EventFilters onFilterChange={mockOnFilterChange} />);
    
    // Check that search input is rendered
    expect(screen.getByPlaceholderText('Search events...')).toBeInTheDocument();
    
    // Check that status select is rendered
    expect(screen.getByText('All Statuses')).toBeInTheDocument();
    
    // Check that sort select is rendered
    expect(screen.getByText('Newest First')).toBeInTheDocument();
    
    // Check that reset button is rendered
    expect(screen.getByText('Reset Filters')).toBeInTheDocument();
  });
  
  test('renders with initial filters', () => {
    const initialFilters = {
      search: 'test',
      status: 'active',
      sortBy: 'name-asc',
    };
    
    render(
      <EventFilters 
        onFilterChange={mockOnFilterChange} 
        initialFilters={initialFilters} 
      />
    );
    
    // Check that search input has initial value
    expect(screen.getByPlaceholderText('Search events...')).toHaveValue('test');
    
    // Status and sort selects are harder to test because they use Radix UI
    // We would need to open the dropdowns and check the selected values
  });
  
  test('calls onFilterChange when search input changes', async () => {
    render(<EventFilters onFilterChange={mockOnFilterChange} />);
    
    const searchInput = screen.getByPlaceholderText('Search events...');
    
    // Type in search input
    await userEvent.type(searchInput, 'test');
    
    // Check that onFilterChange was called with updated filters
    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({
          search: 'test',
          status: 'all',
          sortBy: 'newest',
        })
      );
    });
  });
  
  test('clears search when clear button is clicked', async () => {
    const initialFilters = {
      search: 'test',
      status: 'all',
      sortBy: 'newest',
    };
    
    render(
      <EventFilters 
        onFilterChange={mockOnFilterChange} 
        initialFilters={initialFilters} 
      />
    );
    
    // Check that search input has initial value
    const searchInput = screen.getByPlaceholderText('Search events...');
    expect(searchInput).toHaveValue('test');
    
    // Click clear button (X button)
    const clearButton = screen.getByRole('button', { name: 'Clear search' });
    await userEvent.click(clearButton);
    
    // Check that onFilterChange was called with empty search
    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({
          search: '',
          status: 'all',
          sortBy: 'newest',
        })
      );
    });
    
    // Check that search input is cleared
    expect(searchInput).toHaveValue('');
  });
  
  test('resets filters when reset button is clicked', async () => {
    const initialFilters = {
      search: 'test',
      status: 'active',
      sortBy: 'name-asc',
    };
    
    render(
      <EventFilters 
        onFilterChange={mockOnFilterChange} 
        initialFilters={initialFilters} 
      />
    );
    
    // Click reset button
    const resetButton = screen.getByText('Reset Filters');
    await userEvent.click(resetButton);
    
    // Check that onFilterChange was called with default filters
    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith({
        search: '',
        status: 'all',
        sortBy: 'newest',
      });
    });
  });
});