import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/utils/test-utils';
import LoginForm from '../LoginForm';
import userEvent from '@testing-library/user-event';
import { useAuth } from '@/hooks/useAuth';

// Mock useAuth
vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

describe('LoginForm', () => {
  it('renders login form correctly', () => {
    (useAuth as any).mockReturnValue({ login: vi.fn(), clearError: vi.fn() });
    render(<LoginForm />);
    expect(screen.getByPlaceholderText('Masukkan username Anda')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Masukkan password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /masuk/i })).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    (useAuth as any).mockReturnValue({ login: vi.fn(), clearError: vi.fn() });
    render(<LoginForm />);
    fireEvent.click(screen.getByRole('button', { name: /masuk/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Username wajib diisi')).toBeInTheDocument();
      expect(screen.getByText('Password wajib diisi')).toBeInTheDocument();
    });
  });

  it('calls login function on valid submit', async () => {
    const mockLogin = vi.fn();
    (useAuth as any).mockReturnValue({ login: mockLogin, clearError: vi.fn() });
    
    render(<LoginForm />);
    
    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText('Masukkan username Anda'), 'testuser');
    await user.type(screen.getByPlaceholderText('Masukkan password'), 'password123');
    await user.click(screen.getByRole('button', { name: /masuk/i }));
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({ username: 'testuser', password: 'password123', rememberMe: false });
    });
  });
});
