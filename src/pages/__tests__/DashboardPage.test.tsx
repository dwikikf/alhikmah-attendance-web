import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@/utils/test-utils';
import { screen } from '@testing-library/react';
import DashboardPage from '../DashboardPage';
import { useAuth } from '@/hooks/useAuth';
import * as dashboardQueries from '@/queries/useDashboardQuery';

vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/queries/useDashboardQuery', () => ({
  useTotalClasses: vi.fn(),
  useTodayAttendanceSummary: vi.fn(),
}));

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as any).mockReturnValue({ user: { name: 'Test User' }, isLoading: false });
    (dashboardQueries.useTotalClasses as any).mockReturnValue({
      data: { total: 5, classes: [{ id: '1', student_count: 30 }] },
      isLoading: false
    });
    (dashboardQueries.useTodayAttendanceSummary as any).mockReturnValue({
      data: { hadir: 25, izin: 2, sakit: 3, tanpa_keterangan: 0 },
      isLoading: false
    });
  });

  it('renders dashboard page correctly', () => {
    render(<DashboardPage />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText(/Selamat datang kembali, Test User/i)).toBeInTheDocument();
    expect(screen.getByText('Total Siswa Aktif')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument(); // total students
  });
});
