import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginPage from '../pages/LoginPage';
import Dashboard from '../pages/Dashboard';

vi.mock('../utils/detectPerformance', () => ({
  assessDeviceCapability: vi.fn().mockResolvedValue('POTATO_DEVICE'),
}));

window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.alert = vi.fn();

describe('StatSkill AI - 6th Officer & Dynamic Custom User Frontend Integration Suite', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();

    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('/api/courses/search')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true, courses: [] }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({ success: true }),
      });
    });
  });

  it('Person 2 [DPD]: Renders Ananya Mehta (Senior Statistical Officer) in Jan Parichay SSO selector', async () => {
    const handleAuth = vi.fn();
    render(<LoginPage onAuthenticate={handleAuth} />);

    // Load sample officers
    fireEvent.click(screen.getByRole('button', { name: /Load Sample Demo Officers/i }));

    // Check that SSO officer button exists
    const ssoOption = await screen.findByRole('button', {
      name: /Senior Statistical Officer \(SSO\)/i,
    });
    expect(ssoOption).toBeInTheDocument();

    // Click on SSO officer
    fireEvent.click(ssoOption);

    // Click Continue
    const continueBtn = screen.getByRole('button', {
      name: /LOG IN TO WORKSPACE/i,
    });
    expect(continueBtn).toBeInTheDocument();
    fireEvent.click(continueBtn);

    expect(handleAuth).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Ananya Mehta',
        designation: 'Senior Statistical Officer (SSO)',
        division: 'Data Processing Division (DPD), NSSO',
        cadre: 'Subordinate Statistical Service (SSS)',
        parichayId: 'PARICHAY_2088_NSSO',
      }),
      'parichay-id'
    );
  });

  it('Person 6 [ESD]: Renders Economic Statistics Division identity and price statistics competencies in Dashboard', async () => {
    window.localStorage.setItem(
      'statskill_demo_login',
      JSON.stringify({
        token: 'mock-jwt-token-esd',
        officer: {
          id: 'deputy-director',
          name: 'Dr. Vikram Seth',
          designation: 'Deputy Director [Price Statistics] (ISS)',
          division: 'Economic Statistics Division (ESD), MoSPI',
          cadre: 'Indian Statistical Service (ISS)',
          parichayId: 'PARICHAY_6120_ISS',
        },
      })
    );

    window.localStorage.setItem(
      'statskill_officer_progress_v1',
      JSON.stringify({
        'Deputy Director [Price Statistics] (ISS)': {
          assessmentsTaken: 1,
          proficiency: {
            'Price Statistics & Index Number Theory': 4,
            'High-Frequency Econometric Modeling': 4,
            'Official Dissemination & Data Governance': 4,
            'Inter-Ministerial Stakeholder Consultation': 4,
          },
        },
      })
    );

    render(<Dashboard activeTab="overview" />);

    // Verify division name and officer name are rendered
    expect(screen.getAllByText(/Dr\. Vikram Seth/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Economic Statistics Division/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Deputy Director/i).length).toBeGreaterThan(0);

    // Verify ESD specific competency benchmarks
    expect(screen.getAllByText('Price Statistics & Index Number Theory').length).toBeGreaterThan(0);
    expect(screen.getAllByText('High-Frequency Econometric Modeling').length).toBeGreaterThan(0);
  });

  it('Dynamic Custom User: Renders completely custom user profile on Dashboard dynamically', async () => {
    window.localStorage.setItem(
      'statskill_demo_login',
      JSON.stringify({
        token: 'mock-jwt-token-custom',
        officer: {
          id: 'custom-officer-99',
          name: 'Prof. Maya Sen',
          designation: 'Director [Health Statistics] (ISS)',
          division: 'Health Intelligence & Epidemiological Statistics Division',
          cadre: 'Indian Statistical Service (ISS)',
          parichayId: 'PARICHAY_8844_ISS',
        },
      })
    );

    render(<Dashboard activeTab="overview" />);

    expect(screen.getAllByText(/Prof\. Maya Sen/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Health Intelligence & Epidemiological Statistics Division/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Director \[Health Statistics\]/i).length).toBeGreaterThan(0);
  });
});
