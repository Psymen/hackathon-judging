import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { mockAPI } from '@/lib/mock-data';

// Mock the mockAPI
jest.mock('@/lib/mock-data', () => ({
  mockAPI: {
    authenticateUser: jest.fn(),
    getUserByEmail: jest.fn(),
    createUser: jest.fn(),
  },
}));

// Test component that uses the auth context
const TestComponent = () => {
  const { user, login, register, logout, loading } = useAuth();
  
  return (
    <div>
      <div data-testid="loading-state">{loading ? 'Loading' : 'Not Loading'}</div>
      <div data-testid="user-state">{user ? JSON.stringify(user) : 'No User'}</div>
      <button 
        data-testid="login-button" 
        onClick={() => login('test@example.com', 'password123')}
      >
        Login
      </button>
      <button 
        data-testid="register-button" 
        onClick={() => register('Test User', 'test@example.com', 'password123')}
      >
        Register
      </button>
      <button data-testid="logout-button" onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Clear localStorage
    localStorage.clear();
  });
  
  test('should provide initial auth state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByTestId('loading-state')).toHaveTextContent('Not Loading');
    expect(screen.getByTestId('user-state')).toHaveTextContent('No User');
  });
  
  test('should handle login success', async () => {
    const mockUser = { 
      id: 'user-123', 
      name: 'Test User', 
      email: 'test@example.com', 
      role: 'judge' 
    };
    
    // Mock successful authentication
    (mockAPI.authenticateUser as jest.Mock).mockResolvedValue(mockUser);
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Click login button
    await act(async () => {
      userEvent.click(screen.getByTestId('login-button'));
    });
    
    // Check loading state during authentication
    expect(screen.getByTestId('loading-state')).toHaveTextContent('Loading');
    
    // Wait for authentication to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading-state')).toHaveTextContent('Not Loading');
    });
    
    // Check that user is set
    expect(screen.getByTestId('user-state')).toHaveTextContent(JSON.stringify(mockUser));
    
    // Verify that authenticateUser was called with correct arguments
    expect(mockAPI.authenticateUser).toHaveBeenCalledWith('test@example.com', 'password123');
  });
  
  test('should handle login failure', async () => {
    // Mock failed authentication
    (mockAPI.authenticateUser as jest.Mock).mockResolvedValue(null);
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Click login button
    await act(async () => {
      userEvent.click(screen.getByTestId('login-button'));
    });
    
    // Wait for authentication to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading-state')).toHaveTextContent('Not Loading');
    });
    
    // Check that user is still null
    expect(screen.getByTestId('user-state')).toHaveTextContent('No User');
  });
  
  test('should handle registration success', async () => {
    const mockUser = { 
      id: 'user-123', 
      name: 'Test User', 
      email: 'test@example.com', 
      role: 'judge' 
    };
    
    // Mock successful user creation
    (mockAPI.createUser as jest.Mock).mockResolvedValue(mockUser);
    // Mock email check (user doesn't exist)
    (mockAPI.getUserByEmail as jest.Mock).mockResolvedValue(null);
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Click register button
    await act(async () => {
      userEvent.click(screen.getByTestId('register-button'));
    });
    
    // Wait for registration to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading-state')).toHaveTextContent('Not Loading');
    });
    
    // Verify that createUser was called with correct arguments
    expect(mockAPI.createUser).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'judge',
    });
    
    // Registration should return true for success
    expect(screen.getByTestId('user-state')).toHaveTextContent('No User');
  });
  
  test('should handle registration failure when email exists', async () => {
    const existingUser = { 
      id: 'existing-user', 
      name: 'Existing User', 
      email: 'test@example.com', 
      role: 'judge' 
    };
    
    // Mock email check (user exists)
    (mockAPI.getUserByEmail as jest.Mock).mockResolvedValue(existingUser);
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Click register button
    await act(async () => {
      userEvent.click(screen.getByTestId('register-button'));
    });
    
    // Wait for registration check to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading-state')).toHaveTextContent('Not Loading');
    });
    
    // Verify that createUser was not called
    expect(mockAPI.createUser).not.toHaveBeenCalled();
  });
  
  test('should handle logout', async () => {
    const mockUser = { 
      id: 'user-123', 
      name: 'Test User', 
      email: 'test@example.com', 
      role: 'judge' 
    };
    
    // Set initial user state
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Wait for initial state to load from localStorage
    await waitFor(() => {
      expect(screen.getByTestId('user-state')).toHaveTextContent(JSON.stringify(mockUser));
    });
    
    // Click logout button
    await act(async () => {
      userEvent.click(screen.getByTestId('logout-button'));
    });
    
    // Check that user is cleared
    expect(screen.getByTestId('user-state')).toHaveTextContent('No User');
    
    // Check that localStorage is cleared
    expect(localStorage.getItem('user')).toBeNull();
  });
  
  test('should load user from localStorage on mount', async () => {
    const mockUser = { 
      id: 'user-123', 
      name: 'Test User', 
      email: 'test@example.com', 
      role: 'judge' 
    };
    
    // Set user in localStorage before mounting
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Check that user is loaded from localStorage
    await waitFor(() => {
      expect(screen.getByTestId('user-state')).toHaveTextContent(JSON.stringify(mockUser));
    });
  });
});