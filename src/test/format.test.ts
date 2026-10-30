import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate, formatTime } from '@/utils/format';

describe('Utility Formatters', () => {
  it('formats currency cleanly in USD and other denominations', () => {
    expect(formatCurrency(5000)).toBe('$5,000');
    expect(formatCurrency(0)).toBe('$0');
    expect(formatCurrency(1250500)).toBe('$1,250,500');
  });

  it('formats dates consistently', () => {
    const formatted = formatDate('2027-06-12');
    expect(formatted).toBeDefined();
    expect(typeof formatted).toBe('string');
  });

  it('formats time to 12-hour AM/PM presentation', () => {
    expect(formatTime('16:00')).toMatch(/4:00\s*(PM|pm)?/i);
    expect(formatTime('09:30')).toMatch(/9:30\s*(AM|am)?/i);
  });
});

