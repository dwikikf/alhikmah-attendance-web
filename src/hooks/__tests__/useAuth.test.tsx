import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../useAuth';
import { AuthProvider } from '@/contexts/AuthContext';
import * as authUtils from '@/utils/auth';

vi.mock('@/utils/auth', () => ({
  setAccessToken: vi.fn(),
  getAccessToken: vi.fn(),
  removeAccessToken: vi.fn(),
  setRefreshToken: vi.fn(),
  getRefreshToken: vi.fn(),
  removeRefreshToken: vi.fn(),
  setTokens: vi.fn(),
  getTokens: vi.fn(),
  removeTokens: vi.fn(),
  decodeToken: vi.fn(),
  isTokenExpired: vi.fn(),
  hasValidAuth: vi.fn(),
  getUserFromToken: vi.fn(),
  getRememberMe: vi.fn(),
  setRememberMe: vi.fn(),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with unauthenticated state', () => {
    (authUtils.getAccessToken as any).mockReturnValue(null);
    (authUtils.hasValidAuth as any).mockReturnValue(false);
    (authUtils.getUserFromToken as any).mockReturnValue(null);
    
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  // Note: More complex tests for login/logout would require mocking the authService
});
