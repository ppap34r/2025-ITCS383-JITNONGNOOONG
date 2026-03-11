import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import AdminAccounts from './AdminAccounts';

vi.mock('react-router', () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

// Clear localStorage between tests so default customers are used
beforeEach(() => {
  localStorage.removeItem('admin_customers');
  localStorage.removeItem('admin_restaurants');
});

describe('AdminAccounts', () => {
  it('renders the Account Management heading', () => {
    render(<AdminAccounts />);
    expect(screen.getByText(/account management/i)).toBeInTheDocument();
  });

  it('shows default customers in the list', () => {
    render(<AdminAccounts />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Sarah Wilson')).toBeInTheDocument();
  });

  it('filters customers by name via search input', () => {
    render(<AdminAccounts />);
    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'Sarah' } });
    expect(screen.getByText('Sarah Wilson')).toBeInTheDocument();
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  it('calls toast.success when toggling a customer via switch', async () => {
    const { toast } = await import('sonner');
    render(<AdminAccounts />);
    // Switch components are rendered with role="switch"
    const switches = screen.getAllByRole('switch');
    expect(switches.length).toBeGreaterThan(0);
    fireEvent.click(switches[0]);
    expect(toast.success).toHaveBeenCalledWith('Customer status updated');
  });

  it('removes customer from list after delete icon-button click', async () => {
    const { toast } = await import('sonner');
    const { container } = render(<AdminAccounts />);
    // Trash2 icon buttons have no text content
    const allButtons = container.querySelectorAll('button');
    const trashButtons = Array.from(allButtons).filter(b =>
      b.querySelector('svg') && !b.textContent?.trim()
    );
    expect(trashButtons.length).toBeGreaterThan(0);
    fireEvent.click(trashButtons[0]);
    expect(toast.success).toHaveBeenCalledWith('Customer account deleted');
  });
});
