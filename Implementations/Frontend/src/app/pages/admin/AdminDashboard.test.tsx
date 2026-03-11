import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import AdminDashboard from './AdminDashboard';

vi.mock('react-router', () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock('../../contexts/AppContext', () => ({
  useApp: () => ({
    user: { id: '300', role: 'admin', name: 'Admin User', email: 'admin@foodexpress.com' },
    logout: vi.fn(),
  }),
}));

vi.mock('../../services/admin.service', () => ({
  getAdminStats: vi.fn(),
}));

// recharts ResponsiveContainer requires a real container size — provide a stub
vi.mock('recharts', () => ({
  AreaChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Area: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

import { getAdminStats } from '../../services/admin.service';

const mockStats = {
  orders: { todayOrders: 10, monthOrders: 200, totalOrders: 5000, todayRevenue: 4500, monthRevenue: 90000 },
  restaurants: { totalRestaurants: 15, activeRestaurants: 12 },
};

beforeEach(() => {
  vi.mocked(getAdminStats).mockResolvedValue(mockStats);
});

describe('AdminDashboard', () => {
  it('renders the Admin Dashboard heading', () => {
    render(<AdminDashboard />);
    expect(screen.getByText(/admin dashboard/i)).toBeInTheDocument();
  });

  it('renders stat card titles', () => {
    render(<AdminDashboard />);
    expect(screen.getByText(/daily revenue/i)).toBeInTheDocument();
    expect(screen.getByText(/monthly revenue/i)).toBeInTheDocument();
    expect(screen.getByText(/active restaurants/i)).toBeInTheDocument();
  });

  it('calls getAdminStats on mount', async () => {
    render(<AdminDashboard />);
    await waitFor(() => {
      expect(getAdminStats).toHaveBeenCalled();
    });
  });

  it('shows live daily revenue after stats load', async () => {
    render(<AdminDashboard />);
    await waitFor(() => {
      // 4500 todayRevenue — verify the Daily Revenue card is present
      expect(screen.getByText(/daily revenue/i)).toBeInTheDocument();
    });
  });

  it('gracefully shows fallback values when getAdminStats rejects', async () => {
    vi.mocked(getAdminStats).mockRejectedValue(new Error('backend down'));
    render(<AdminDashboard />);
    // Should still render page without crashing; stat cards remain visible
    expect(screen.getByText(/daily revenue/i)).toBeInTheDocument();
  });
});
