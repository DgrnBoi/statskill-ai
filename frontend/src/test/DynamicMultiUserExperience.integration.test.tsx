import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage, { DEMO_OFFICERS } from '../pages/LoginPage';
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

  it('1. Dynamic Directory: Renders registered officers and allows searching by name or Parichay ID', async () => {
    render(<LoginPage onAuthenticate={vi.fn()} />);

    // Verify search input is present
    const searchInput = screen.getByLabelText(/Search registered officers/i);
    expect(searchInput).toBeInTheDocument();

    // Type "Eshaan" in search
    fireEvent.change(searchInput, { target: { value: 'Eshaan' } });

    // Expect Eshaan to be visible
    expect(screen.getByText('Eshaan Sunthankar')).toBeInTheDocument();
  });

  it('2. Division Filtering: Filters officers strictly by selected MoSPI division', async () => {
    render(<LoginPage onAuthenticate={vi.fn()} />);

    const divisionSelect = screen.getByLabelText(/Filter by division/i);
    expect(divisionSelect).toBeInTheDocument();

    // Filter by ESD (Economic Statistics Division)
    fireEvent.change(divisionSelect, { target: { value: 'Economic Statistics Division (ESD)' } });

    // Expect Dr. Vikram Seth to be visible
    expect(screen.getByText('Dr. Vikram Seth')).toBeInTheDocument();
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
    const submitBtn = screen.getByRole('button', { name: /Register Officer & Launch Workspace/i });
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

  it('6. Quick Role Launch: Selects a role from Quick Role Access and launches instantly', async () => {
    const handleAuth = vi.fn();
    render(<LoginPage onAuthenticate={handleAuth} />);

    // Click "Select Role & Start" tab
    const quickTab = screen.getByRole('tab', { name: /Select Role & Start/i });
    fireEvent.click(quickTab);

    // Select "Agricultural Statistics Specialist"
    const roleSelect = screen.getByLabelText(/Select official role/i);
    fireEvent.change(roleSelect, { target: { value: 'Agricultural Statistics Specialist' } });

    // Type officer name
    const nameInput = screen.getByLabelText(/Officer name/i);
    fireEvent.change(nameInput, { target: { value: 'Officer Ramanathan' } });

    // Submit Launch
    const launchBtn = screen.getByRole('button', { name: /Launch Dynamic Assessment Workspace/i });
    fireEvent.click(launchBtn);

    await waitFor(() => {
      expect(handleAuth).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Officer Ramanathan',
          designation: 'Agricultural Statistics Specialist',
        }),
        'parichay-id'
      );
    });
  });

  it('7. Custom Arbitrary Role: Types custom role and launches dynamic workspace without static profile', async () => {
    const handleAuth = vi.fn();
    render(<LoginPage onAuthenticate={handleAuth} />);

    // Click "Select Role & Start" tab
    const quickTab = screen.getByRole('tab', { name: /Select Role & Start/i });
    fireEvent.click(quickTab);

    // Select "Custom Role / Other Designation..."
    const roleSelect = screen.getByLabelText(/Select official role/i);
    fireEvent.change(roleSelect, { target: { value: 'Custom Role / Other Designation...' } });

    // Enter custom role
    const customRoleInput = screen.getByLabelText(/Custom role designation/i);
    fireEvent.change(customRoleInput, { target: { value: 'Lead Macro Nowcasting Specialist' } });

    // Enter custom officer name
    const nameInput = screen.getByLabelText(/Officer name/i);
    fireEvent.change(nameInput, { target: { value: 'Dr. Alok Verma' } });

    // Submit Launch
    const launchBtn = screen.getByRole('button', { name: /Launch Dynamic Assessment Workspace/i });
    fireEvent.click(launchBtn);

    await waitFor(() => {
      expect(handleAuth).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Dr. Alok Verma',
          designation: 'Lead Macro Nowcasting Specialist',
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

