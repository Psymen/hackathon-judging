import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ProtectedRoute } from '@/components/protected-route';
import { useAuth } from '@/lib/auth-context';

// Mock the useAuth hook
jest.mock('@/lib/auth-context', () => ({
  useAuth: jest.fn(),
}));

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('ProtectedRoute', () => {
  const mockPush = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock useRouter
    jest.requireMock('next/navigation').useRouter.mockReturnValue({
      push: mockPush,
    });
  });
  
  test('renders loading state when checking authentication', () => {
    // Mock useAuth to return loading state
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      loading: true,
    });
    
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    
    // Check that loading state is rendered
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
  
  test('redirects to login when user is not authenticated', async () => {
    // Mock useAuth to return not authenticated state
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      loading: false,
    });
    
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    
    // Check that content is not rendered
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    
    // Check that router.push was called with login path
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });
  
  test('renders content when user is authenticated', () => {
    // Mock useAuth to return authenticated state
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: 'user-123', name: 'Test User', email: 'test@example.com', role: 'admin' },
      loading: false,
    });
    
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    
    // Check that content is rendered
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    
    // Check that router.push was not called
    expect(mockPush).not.toHaveBeenCalled();
  });
  
  test('redirects when user does not have required role', async () => {
    // Mock useAuth to return authenticated state with judge role
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: 'user-123', name: 'Test User', email: 'test@example.com', role: 'judge' },
      loading: false,
    });
    
    render(
      <ProtectedRoute allowedRoles={['admin']}>
        <div>Admin Content</div>
      </ProtectedRoute>
    );
    
    // Check that content is not rendered
    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
    
    // Check that router.push was called with appropriate path for judge
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/judge/events');
    });
  });
  
  test('renders content when user has required role', () => {
    // Mock useAuth to return authenticated state with admin role
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: 'user-123', name: 'Test User', email: 'test@example.com', role: 'admin' },
      loading: false,
    });
    
    render(
      <ProtectedRoute allowedRoles={['admin']}>
        <div>Admin Content</div>
      </ProtectedRoute>
    );
    
    // Check that content is rendered
    expect(screen.getByText('Admin Content')).toBeInTheDocument();
    
    // Check that router.push was not called
    expect(mockPush).not.toHaveBeenCalled();
  });
  
  test('renders content when user has one of multiple allowed roles', () => {
    // Mock useAuth to return authenticated state with judge role
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: 'user-123', name: 'Test User', email: 'test@example.com', role: 'judge' },
      loading: false,
    });
    
    render(
      <ProtectedRoute allowedRoles={['admin', 'judge']}>
        <div>Shared Content</div>
      </ProtectedRoute>
    );
    
    // Check that content is rendered
    expect(screen.getByText('Shared Content')).toBeInTheDocument();
    
    // Check that router.push was not called
    expect(mockPush).not.toHaveBeenCalled();
  });
});