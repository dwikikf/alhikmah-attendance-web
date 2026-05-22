import { describe, it, expect } from 'vitest';
import { loginSchema } from '@/utils/validators';

describe('validators', () => {
  describe('loginSchema', () => {
    it('should validate a correct username and password', () => {
      const result = loginSchema.safeParse({ username: 'testuser', password: 'password123' });
      expect(result.success).toBe(true);
    });

    it('should fail on missing username', () => {
      const result = loginSchema.safeParse({ username: '', password: 'password123' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Username wajib diisi');
      }
    });

    it('should fail on missing password', () => {
      const result = loginSchema.safeParse({ username: 'testuser', password: '' });
      expect(result.success).toBe(false);
    });
  });
});
