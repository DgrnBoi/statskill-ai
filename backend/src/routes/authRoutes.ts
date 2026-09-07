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
  'deputy-director': {
    parichayId: 'PARICHAY_6120_ISS',
    name: 'Dr. Vikram Seth',
    email: 'vikram.seth@mospi.gov.in',
    designation: 'Deputy Director [Price Statistics] (ISS)',
    division: 'Economic Statistics Division (ESD), MoSPI',
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

router.post('/custom-login', (req, res) => {
  const { officer, method = 'parichay-id' } = req.body ?? {};

  if (!officer || !officer.designation || !officer.name) {
    return res.status(400).json({ error: 'A valid officer profile containing at least name and designation is required.' });
  }

  if (!['parichay-id', 'mobile-otp'].includes(method)) {
    return res.status(400).json({ error: 'A valid authentication method (parichay-id or mobile-otp) is required.' });
  }

  const signingSecret = process.env.JWT_SECRET;
  if (!signingSecret) {
    return res.status(503).json({ error: 'Authentication signing secret is not configured.' });
  }

  const payload = {
    parichayId: officer.parichayId || `PARICHAY_${Math.floor(1000 + Math.random() * 9000)}_CUSTOM`,
    name: officer.name,
    email: officer.email || `${officer.name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@mospi.gov.in`,
    designation: officer.designation,
    division: officer.division || 'Official Statistics Division, MoSPI',
    cadre: officer.cadre || 'Indian Statistical Service (ISS)',
    authMethod: method,
  };

  const token = jwt.sign(payload, signingSecret, { expiresIn: '8h' });
  return res.status(200).json({ token, officer: payload, expiresIn: 28800 });
});

export default router;
