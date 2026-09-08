import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../pages/LoginPage';
import { DEMO_OFFICERS } from '../data/demoOfficers';
import Dashboard from '../pages/Dashboard';

vi.mock('../utils/detectPerformance', () => ({
  assessDeviceCapability: vi.fn().mockResolvedValue('POTATO_DEVICE'),
}));

window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.alert = vi.fn();

describe('StatSkill AI - Dynamic Multi-User & Individualized Experience Frontend Integration Suite', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();

    global.fetch = vi.fn().mockImplementation((url: string, options?: any) => {
      if (url.includes('/api/auth/users')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            success: true,
            count: DEMO_OFFICERS.length,
            users: DEMO_OFFICERS,
          }),
        });
      }
      if (url.includes('/api/auth/register')) {
        const body = options?.body ? JSON.parse(options.body) : {};
        return Promise.resolve({
          ok: true,
          status: 201,
          json: async () => ({
            success: true,
            token: 'jwt-mock-registered-user',
            officer: body,
          }),
        });
      }
      if (url.includes('/api/courses/search')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true, courses: [] }),
        });
      }
      if (url.includes('/api/recommend/analyze-assessment')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            success: true,
            analysis: {
              scorePercentage: 100,
              status: 'passed',
              updatedProficiency: { 'Survey Design & Sampling': 4 },
              misconceptionsFound: [],
              recommendedCohorts: [],
            },
          }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({ success: true }),
      });
    });
  });

  it('1. Directory Search: Filters officer list dynamically by text query', async () => {
    render(<LoginPage onAuthenticate={vi.fn()} />);

    // Load sample officers
    fireEvent.click(screen.getByRole('button', { name: /Load Sample Demo Officers/i }));

    const searchInput = screen.getByLabelText(/Search registered officers/i);
    expect(searchInput).toBeInTheDocument();

    // Type "Rajesh" in search
    fireEvent.change(searchInput, { target: { value: 'Rajesh' } });

    // Expect Rajesh to be visible
    expect(await screen.findByText('Rajesh Sharma')).toBeInTheDocument();
  });

  it('2. Division Filtering: Filters officers strictly by selected MoSPI division', async () => {
    render(<LoginPage onAuthenticate={vi.fn()} />);

    // Load sample officers
    fireEvent.click(screen.getByRole('button', { name: /Load Sample Demo Officers/i }));

    const divisionSelect = screen.getByLabelText(/Filter by division/i);
    expect(divisionSelect).toBeInTheDocument();

    // Filter by DPD (Data Processing Division)
    fireEvent.change(divisionSelect, { target: { value: 'Data Processing Division (DPD)' } });

    // Expect Ananya Mehta to be visible
    expect(await screen.findByText('Ananya Mehta')).toBeInTheDocument();
  });

  it('3. On-the-Fly Officer Registration: Switches to registration form, registers a dynamic officer, and launches workspace', async () => {
    const handleAuth = vi.fn();
    render(<LoginPage onAuthenticate={handleAuth} />);

    // Switch tab to "Register New Officer"
    const registerTab = screen.getByRole('tab', { name: /Register New Officer/i });
    fireEvent.click(registerTab);

    // Fill registration form
    const nameInput = screen.getByPlaceholderText(/e\.g\., Dr\. Meenakshi Sundaram/i);
    fireEvent.change(nameInput, { target: { value: 'Dr. Meenakshi Sundaram' } });

    const locationInput = screen.getByPlaceholderText(/e\.g\. New Delhi, Kolkata, Mumbai/i);
    fireEvent.change(locationInput, { target: { value: 'Kolkata' } });

    // Submit registration
    const submitBtn = screen.getByRole('button', { name: /REGISTER & LOG IN TO WORKSPACE/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(handleAuth).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Dr. Meenakshi Sundaram',
          location: 'Kolkata',
        }),
        'parichay-id'
      );
    });
  });

  it('4. User Individuality: Renders completely distinct dynamic dashboard identities and competencies', async () => {
    // Set authenticated session for registered officer Dr. Meenakshi Sundaram
    window.localStorage.setItem(
      'statskill_demo_login',
      JSON.stringify({
        token: 'mock-jwt-token-sundaram',
        officer: {
          id: 'usr_sundaram_01',
          name: 'Dr. Meenakshi Sundaram',
          designation: 'Director [Training] (ISS)',
          division: 'National Statistical Systems Training Academy (NSSTA)',
          cadre: 'Indian Statistical Service (ISS)',
          parichayId: 'PARICHAY_8899_ISS',
        },
      })
    );

    render(<Dashboard activeTab="overview" />);

    // Check individual name, division, and Parichay ID rendered on dashboard
    expect(screen.getAllByText(/Dr\. Meenakshi Sundaram/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/National Statistical Systems Training Academy/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Director \[Training\]/i).length).toBeGreaterThan(0);
  });

  it('5. Independent Progress: Verifies another officer has separate isolated progress', async () => {
    // Log in as Officer 2: Ananya Mehta
    window.localStorage.setItem(
      'statskill_demo_login',
      JSON.stringify({
        token: 'mock-jwt-token-mehta',
        officer: {
          id: 'usr_2088',
          name: 'Ananya Mehta',
          designation: 'Senior Statistical Officer (SSO)',
          division: 'Data Processing Division (DPD), NSSO',
          cadre: 'Subordinate Statistical Service (SSS)',
          parichayId: 'PARICHAY_2088_NSSO',
        },
      })
    );

    render(<Dashboard activeTab="overview" />);

    // Verify Ananya Mehta is displayed, NOT Dr. Meenakshi Sundaram
    expect(screen.getAllByText(/Ananya Mehta/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Data Processing Division/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/Dr\. Meenakshi Sundaram/i)).not.toBeInTheDocument();
  });

  it('6. Register Officer Launch: Registers a new officer and launches workspace', async () => {
    const handleAuth = vi.fn();
    render(<LoginPage onAuthenticate={handleAuth} />);

    // Click "Register New Officer" tab
    const registerTab = screen.getByRole('tab', { name: /Register New Officer/i });
    fireEvent.click(registerTab);

    // Type officer name
    const nameInput = screen.getByPlaceholderText(/e\.g\., Dr\. Meenakshi Sundaram/i);
    fireEvent.change(nameInput, { target: { value: 'Officer Ramanathan' } });

    // Submit Registration
    const launchBtn = screen.getByRole('button', { name: /REGISTER & LOG IN TO WORKSPACE/i });
    fireEvent.click(launchBtn);

    await waitFor(() => {
      expect(handleAuth).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Officer Ramanathan',
        }),
        'parichay-id'
      );
    });
  });

  it('7. Custom Arbitrary Role: Registers custom officer name and launches dynamic workspace', async () => {
    const handleAuth = vi.fn();
    render(<LoginPage onAuthenticate={handleAuth} />);

    // Click "Register New Officer" tab
    const registerTab = screen.getByRole('tab', { name: /Register New Officer/i });
    fireEvent.click(registerTab);

    // Enter custom officer name
    const nameInput = screen.getByPlaceholderText(/e\.g\., Dr\. Meenakshi Sundaram/i);
    fireEvent.change(nameInput, { target: { value: 'Dr. Alok Verma' } });

    // Submit Registration
    const launchBtn = screen.getByRole('button', { name: /REGISTER & LOG IN TO WORKSPACE/i });
    fireEvent.click(launchBtn);

    await waitFor(() => {
      expect(handleAuth).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Dr. Alok Verma',
        }),
        'parichay-id'
      );
    });
  });

  it('8. Dynamic 4-Pillar FRAC Rendering: Verifies Dashboard renders 4 pillars dynamically for custom role', async () => {
    window.localStorage.setItem(
      'statskill_demo_login',
      JSON.stringify({
        token: 'mock-jwt-token-custom-agri',
        officer: {
          id: 'dyn_agri_01',
          name: 'Officer Ramanathan',
          designation: 'Agricultural Statistics Specialist',
          division: 'Official Statistics Division, MoSPI',
          cadre: 'Subordinate Statistical Service (SSS)',
          parichayId: 'PARICHAY_7712_NSSO',
        },
      })
    );

    render(<Dashboard activeTab="competency" />);

    // Verify designation header
    expect(screen.getAllByText(/Agricultural Statistics Specialist/i).length).toBeGreaterThan(0);

    // Verify 4-pillar domains are rendered
    expect(screen.getAllByText(/Statistical Competencies/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Technical Competencies/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Digital Governance/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Behavioural and Managerial/i).length).toBeGreaterThan(0);
  });
});

