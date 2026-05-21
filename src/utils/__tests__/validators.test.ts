import { describe, it, expect } from 'vitest';
import { loginSchema } from '@/utils/validators';

describe('validators', () => {
  describe('loginSchema', () => {
    it('should validate a correct email and password', () => {
      const result = loginSchema.safeParse({ email: 'test@example.com', password: 'password123' });
      expect(result.success).toBe(true);
    });

    it('should fail on invalid email', () => {
      const result = loginSchema.safeParse({ email: 'not-an-email', password: 'password123' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Format email tidak valid');
      }
    });

    it('should fail on missing password', () => {
      const result = loginSchema.safeParse({ email: 'test@example.com', password: '' });
      expect(result.success).toBe(false);
    });
  });
});
