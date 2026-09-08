export interface DemoOfficer {
  id: string;
  name: string;
  designation: string;
  division: string;
  cadre: string;
  parichayId: string;
  email?: string;
  mobile?: string;
  location?: string;
  experienceYears?: number;
}

export const DEMO_OFFICERS: DemoOfficer[] = [];

export const SAMPLE_DEMO_OFFICERS: DemoOfficer[] = [
  { id: 'jso', name: 'Rajesh Sharma', designation: 'Junior Statistical Officer (JSO)', division: 'Field Operations Division (FOD), NSSO', cadre: 'Subordinate Statistical Service (SSS)', parichayId: 'PARICHAY_1042_NSSO' },
  { id: 'sso', name: 'Ananya Mehta', designation: 'Senior Statistical Officer (SSO)', division: 'Data Processing Division (DPD), NSSO', cadre: 'Subordinate Statistical Service (SSS)', parichayId: 'PARICHAY_2088_NSSO' },
];
