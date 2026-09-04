// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import LoginPage from './LoginPage';

describe('LoginPage', () => {
  it('passes the selected demo officer and authentication method to the route handoff', () => {
    const onAuthenticate = vi.fn();
    render(<LoginPage onAuthenticate={onAuthenticate} />);

    fireEvent.click(screen.getByRole('button', { name: /Mobile OTP/i }));
    fireEvent.click(screen.getByRole('button', { name: /Director \(ISS\).*DIID/i }));
    fireEvent.click(screen.getByRole('button', { name: /Continue as Director \(ISS\)/i }));

    expect(onAuthenticate).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'director', designation: 'Director (ISS)' }),
      'mobile-otp',
    );
  });
});
