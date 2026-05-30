import { describe, it, expect } from 'vitest';
import { formatDate, formatPercentage, formatNumber, capitalize, truncate } from '../formatters';

describe('formatters', () => {
  it('formats date correctly', () => {
    const date = '2023-12-01T10:00:00Z';
    expect(formatDate(date)).toContain('2023');
  });

  it('handles invalid date', () => {
    expect(formatDate('invalid')).toBe('-');
  });

  it('formats percentage', () => {
    expect(formatPercentage(95.555, 1)).toBe('95.6%');
    expect(formatPercentage(95.555, 2)).toBe('95.56%');
  });

  it('capitalizes string', () => {
    expect(capitalize('hello world')).toBe('Hello World');
  });

  it('truncates string', () => {
    const longString = 'This is a very long string that needs to be truncated';
    expect(truncate(longString, 10)).toBe('This is a ...');
    expect(truncate('short', 10)).toBe('short');
  });
});
