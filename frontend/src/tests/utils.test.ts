import { describe, it, expect } from 'vitest';
import { formatCurrency } from '../lib/utils';

describe('Utils', () => {
  describe('formatCurrency', () => {
    it('formats positive numbers correctly', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
    });

    it('formats zero correctly', () => {
      expect(formatCurrency(0)).toBe('$0.00');
    });

    it('formats large numbers correctly', () => {
      expect(formatCurrency(1234567.89)).toBe('$1,234,567.89');
    });

    it('handles decimal places', () => {
      expect(formatCurrency(99.99)).toBe('$99.99');
      expect(formatCurrency(100)).toBe('$100.00');
    });
  });
});
