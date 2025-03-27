import { formatDate, formatDateRange, getRelativeTime, cn } from '@/lib/utils';

describe('Utils', () => {
  describe('formatDate', () => {
    test('formats date correctly', () => {
      const date = new Date('2025-06-15');
      expect(formatDate(date)).toBe('Jun 15, 2025');
    });
    
    test('handles invalid date', () => {
      const date = new Date('invalid');
      expect(formatDate(date)).toBe('Invalid Date');
    });
  });
  
  describe('formatDateRange', () => {
    test('formats date range with different months', () => {
      const startDate = new Date('2025-06-15');
      const endDate = new Date('2025-07-16');
      expect(formatDateRange(startDate, endDate)).toBe('Jun 15 - Jul 16, 2025');
    });
    
    test('formats date range with same month', () => {
      const startDate = new Date('2025-06-15');
      const endDate = new Date('2025-06-16');
      expect(formatDateRange(startDate, endDate)).toBe('Jun 15-16, 2025');
    });
    
    test('formats date range with different years', () => {
      const startDate = new Date('2025-12-31');
      const endDate = new Date('2026-01-01');
      expect(formatDateRange(startDate, endDate)).toBe('Dec 31, 2025 - Jan 1, 2026');
    });
    
    test('handles invalid dates', () => {
      const startDate = new Date('invalid');
      const endDate = new Date('2025-06-16');
      expect(formatDateRange(startDate, endDate)).toBe('Invalid Date - Jun 16, 2025');
      
      const startDate2 = new Date('2025-06-15');
      const endDate2 = new Date('invalid');
      expect(formatDateRange(startDate2, endDate2)).toBe('Jun 15, 2025 - Invalid Date');
    });
  });
  
  describe('getRelativeTime', () => {
    beforeAll(() => {
      // Mock Date.now() to return a fixed timestamp
      jest.spyOn(Date, 'now').mockImplementation(() => new Date('2025-06-15T12:00:00Z').getTime());
    });
    
    afterAll(() => {
      // Restore Date.now()
      jest.restoreAllMocks();
    });
    
    test('returns "just now" for recent dates', () => {
      const date = new Date('2025-06-15T11:59:30Z'); // 30 seconds ago
      expect(getRelativeTime(date)).toBe('just now');
    });
    
    test('returns minutes ago', () => {
      const date = new Date('2025-06-15T11:58:00Z'); // 2 minutes ago
      expect(getRelativeTime(date)).toBe('2 minutes ago');
      
      const date2 = new Date('2025-06-15T11:59:00Z'); // 1 minute ago
      expect(getRelativeTime(date2)).toBe('1 minute ago');
    });
    
    test('returns hours ago', () => {
      const date = new Date('2025-06-15T10:00:00Z'); // 2 hours ago
      expect(getRelativeTime(date)).toBe('2 hours ago');
      
      const date2 = new Date('2025-06-15T11:00:00Z'); // 1 hour ago
      expect(getRelativeTime(date2)).toBe('1 hour ago');
    });
    
    test('returns days ago', () => {
      const date = new Date('2025-06-13T12:00:00Z'); // 2 days ago
      expect(getRelativeTime(date)).toBe('2 days ago');
      
      const date2 = new Date('2025-06-14T12:00:00Z'); // 1 day ago
      expect(getRelativeTime(date2)).toBe('1 day ago');
    });
    
    test('returns weeks ago', () => {
      const date = new Date('2025-06-01T12:00:00Z'); // 2 weeks ago
      expect(getRelativeTime(date)).toBe('2 weeks ago');
      
      const date2 = new Date('2025-06-08T12:00:00Z'); // 1 week ago
      expect(getRelativeTime(date2)).toBe('1 week ago');
    });
    
    test('returns months ago', () => {
      const date = new Date('2025-04-15T12:00:00Z'); // 2 months ago
      expect(getRelativeTime(date)).toBe('2 months ago');
      
      const date2 = new Date('2025-05-15T12:00:00Z'); // 1 month ago
      expect(getRelativeTime(date2)).toBe('1 month ago');
    });
    
    test('returns years ago', () => {
      const date = new Date('2023-06-15T12:00:00Z'); // 2 years ago
      expect(getRelativeTime(date)).toBe('2 years ago');
      
      const date2 = new Date('2024-06-15T12:00:00Z'); // 1 year ago
      expect(getRelativeTime(date2)).toBe('1 year ago');
    });
    
    test('handles future dates', () => {
      const date = new Date('2025-06-16T12:00:00Z'); // 1 day in the future
      expect(getRelativeTime(date)).toBe('in 1 day');
      
      const date2 = new Date('2025-07-15T12:00:00Z'); // 1 month in the future
      expect(getRelativeTime(date2)).toBe('in 1 month');
    });
    
    test('handles invalid dates', () => {
      const date = new Date('invalid');
      expect(getRelativeTime(date)).toBe('Invalid Date');
    });
  });
  
  describe('cn', () => {
    test('combines class names', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
    });
    
    test('handles conditional class names', () => {
      expect(cn('class1', true && 'class2', false && 'class3')).toBe('class1 class2');
    });
    
    test('handles undefined and null values', () => {
      expect(cn('class1', undefined, null, 'class2')).toBe('class1 class2');
    });
    
    test('handles empty strings', () => {
      expect(cn('class1', '', 'class2')).toBe('class1 class2');
    });
  });
});