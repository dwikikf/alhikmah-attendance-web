import { describe, it, expect, vi } from 'vitest';
import { render } from '@/utils/test-utils';
import { screen } from '@testing-library/react';
import LoginPage from '../LoginPage';
import { useAuth } from '@/hooks/useAuth';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(() => ({ login: vi.fn(), clearError: vi.fn() })),
}));

describe('LoginPage', () => {
  it('renders login page correctly', () => {
    render(<LoginPage />);
    expect(screen.getByRole('button', { name: /masuk/i })).toBeInTheDocument();
  });
});
