import { describe, it, expect, vi } from 'vitest';
import { decodeToken, isTokenExpired } from '../auth';

// mock jwtDecode
vi.mock('jwt-decode', () => ({
  jwtDecode: vi.fn((token) => {
    if (token === 'valid_token') {
      return { sub: '123', exp: Math.floor(Date.now() / 1000) + 3600 };
    }
    if (token === 'expired_token') {
      return { sub: '123', exp: Math.floor(Date.now() / 1000) - 3600 };
    }
    throw new Error('Invalid token');
  })
}));

describe('auth utils', () => {
  describe('decodeToken', () => {
    it('returns decoded payload for valid token', () => {
      const payload = decodeToken('valid_token');
      expect(payload).not.toBeNull();
      expect(payload?.sub).toBe('123');
    });

    it('returns null for invalid token', () => {
      const payload = decodeToken('invalid_token');
      expect(payload).toBeNull();
    });
  });

  describe('isTokenExpired', () => {
    it('returns false for valid token', () => {
      expect(isTokenExpired('valid_token')).toBe(false);
    });

    it('returns true for expired token', () => {
      expect(isTokenExpired('expired_token')).toBe(true);
    });
    
    it('returns true for invalid token', () => {
      expect(isTokenExpired('invalid_token')).toBe(true);
    });
  });
});
