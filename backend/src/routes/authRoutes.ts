import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

const DEMO_OFFICERS = {
  jso: {
    parichayId: 'PARICHAY_1042_NSSO',
    name: 'Eshaan Sunthankar',
    email: 'eshaan.sunthankar@mospi.gov.in',
    designation: 'Junior Statistical Officer (JSO)',
    division: 'Field Operations Division (FOD), NSSO',
    cadre: 'Subordinate Statistical Service (SSS)',
  },
  sso: {
    parichayId: 'PARICHAY_2088_NSSO',
    name: 'Ananya Mehta',
    email: 'ananya.mehta@mospi.gov.in',
    designation: 'Senior Statistical Officer (SSO)',
    division: 'Data Processing Division (DPD), NSSO',
    cadre: 'Subordinate Statistical Service (SSS)',
  },
  'assistant-director': {
    parichayId: 'PARICHAY_3612_ISS',
    name: 'Rohan Iyer',
    email: 'rohan.iyer@mospi.gov.in',
    designation: 'Assistant Director (ISS)',
    division: 'National Accounts Division (NAD)',
    cadre: 'Indian Statistical Service (ISS)',
  },
  director: {
    parichayId: 'PARICHAY_4820_ISS',
    name: 'Kavita Rao',
    email: 'kavita.rao@mospi.gov.in',
    designation: 'Director (ISS)',
    division: 'Data Informatics & Innovation Division (DIID)',
    cadre: 'Indian Statistical Service (ISS)',
  },
  'joint-director': {
    parichayId: 'PARICHAY_5914_ISS',
    name: 'Dr. Rajeshwari Nair',
    email: 'rajeshwari.nair@mospi.gov.in',
    designation: 'Joint Director [SDRD] (ISS)',
    division: 'Survey Design & Research Division (SDRD), NSSO',
    cadre: 'Indian Statistical Service (ISS)',
  },
} as const;

router.post('/demo-login', (req, res) => {
  const { officerId, method } = req.body ?? {};
  const officer = DEMO_OFFICERS[officerId as keyof typeof DEMO_OFFICERS];

  if (!officer || !['parichay-id', 'mobile-otp'].includes(method)) {
    return res.status(400).json({ error: 'A valid demo officer and authentication method are required.' });
  }

  const signingSecret = process.env.JWT_SECRET;
  if (!signingSecret) {
    return res.status(503).json({ error: 'Jan Parichay demo authentication is not configured.' });
  }

  const token = jwt.sign({ ...officer, authMethod: method }, signingSecret, { expiresIn: '8h' });
  return res.status(200).json({ token, expiresIn: 28800 });
});

export default router;
