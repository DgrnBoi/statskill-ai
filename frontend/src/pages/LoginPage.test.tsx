// @vitest-environment jsdom
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import LoginPage from './LoginPage';

describe('LoginPage', () => {
  it('passes the registered officer and authentication method to the route handoff', async () => {
    const onAuthenticate = vi.fn();
    render(<LoginPage onAuthenticate={onAuthenticate} />);

    // Switch to Register New Officer tab
    fireEvent.click(screen.getByRole('tab', { name: /Register New Officer/i }));

    // Fill name and submit
    const nameInput = screen.getByPlaceholderText(/e.g., Dr. Meenakshi Sundaram/i);
    fireEvent.change(nameInput, { target: { value: 'Dr. Meenakshi Sundaram' } });

    const submitBtn = screen.getByRole('button', { name: /REGISTER & LOG IN TO WORKSPACE/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(onAuthenticate).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Dr. Meenakshi Sundaram' }),
        'parichay-id',
      );
    });
  });
});
