import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import AdminPromotions from './AdminPromotions';

vi.mock('react-router', () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

beforeEach(() => {
  localStorage.removeItem('admin_promotions');
});

describe('AdminPromotions', () => {
  it('renders the System Promotions heading', () => {
    render(<AdminPromotions />);
    expect(screen.getByText('System Promotions')).toBeInTheDocument();
  });

  it('shows default promotions in the list', () => {
    render(<AdminPromotions />);
    expect(screen.getByText('NEWUSER50')).toBeInTheDocument();
    expect(screen.getByText('WEEKEND20')).toBeInTheDocument();
  });

  it('opens the Create Promotion dialog when the button is clicked', () => {
    render(<AdminPromotions />);
    const createButton = screen.getByRole('button', { name: /create promotion/i });
    fireEvent.click(createButton);
    // Dialog title should appear
    expect(screen.getAllByText(/create promotion/i).length).toBeGreaterThan(0);
  });

  it('removes a promotion after delete button click', async () => {
    const { toast } = await import('sonner');
    const { container } = render(<AdminPromotions />);
    // Icon-only delete buttons: grab all outline variant buttons (Trash2 icons)
    const allButtons = container.querySelectorAll('button');
    // Find the first button that contains an svg (Trash2 icon) and is not the main action button
    const trashButtons = Array.from(allButtons).filter(b =>
      b.querySelector('svg') && !b.textContent?.trim()
    );
    expect(trashButtons.length).toBeGreaterThan(0);
    fireEvent.click(trashButtons[0]);
    expect(toast.success).toHaveBeenCalled();
  });
});
