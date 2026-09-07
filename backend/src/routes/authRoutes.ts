import express from 'express';
import jwt from 'jsonwebtoken';
import { userDb, UserRecord } from '../db/UserDatabase';

const router = express.Router();

// GET /api/auth/users (List all registered officers with optional search & division filter)
router.get('/users', (req, res) => {
  const { division, cadre, search } = req.query;
  const users = userDb.getAllUsers({
    division: typeof division === 'string' ? division : undefined,
    cadre: typeof cadre === 'string' ? cadre : undefined,
    search: typeof search === 'string' ? search : undefined,
  });
  return res.status(200).json({ success: true, count: users.length, users });
});

// GET /api/auth/user/:id (Get specific officer record)
router.get('/user/:id', (req, res) => {
  const { id } = req.params;
  const user = userDb.getUserById(id) || userDb.getUserByParichayId(id);
  if (!user) {
    return res.status(404).json({ error: 'Officer profile not found.' });
  }
  return res.status(200).json({ success: true, user });
});

// POST /api/auth/register (Create new officer on the fly)
router.post('/register', (req, res) => {
  const { name, designation, division, cadre, parichayId, email, mobile, location, experienceYears } = req.body ?? {};

  if (!name || !designation) {
    return res.status(400).json({ error: 'Officer name and designation are required for registration.' });
  }

  // Check if Parichay ID or email already exists
  if (parichayId && userDb.getUserByParichayId(parichayId)) {
    return res.status(409).json({ error: `Officer with Parichay ID ${parichayId} is already registered.` });
  }
  if (email && userDb.getUserByEmail(email)) {
    return res.status(409).json({ error: `Officer with email ${email} is already registered.` });
  }

  const newUser = userDb.registerUser({
    name,
    designation,
    division,
    cadre,
    parichayId,
    email,
    mobile,
    location,
    experienceYears,
  });

  const signingSecret = process.env.JWT_SECRET;
  if (!signingSecret) {
    return res.status(503).json({ error: 'Authentication signing secret is not configured.' });
  }

  const token = jwt.sign({ ...newUser, authMethod: 'parichay-id' }, signingSecret, { expiresIn: '8h' });
  return res.status(201).json({ success: true, token, officer: newUser, expiresIn: 28800 });
});

// POST /api/auth/login (Login by Parichay ID or Mobile OTP)
router.post('/login', (req, res) => {
  const { identifier, method = 'parichay-id' } = req.body ?? {};

  if (!identifier) {
    return res.status(400).json({ error: 'Parichay ID, email, or mobile number is required to sign in.' });
  }

  const user = userDb.getUserByParichayId(identifier) || userDb.getUserByEmail(identifier) || userDb.getUserByMobile(identifier) || userDb.getUserById(identifier);

  if (!user) {
    return res.status(404).json({ error: 'No registered officer found with the provided credentials.' });
  }

  const signingSecret = process.env.JWT_SECRET;
  if (!signingSecret) {
    return res.status(503).json({ error: 'Authentication signing secret is not configured.' });
  }

  const token = jwt.sign({ ...user, authMethod: method }, signingSecret, { expiresIn: '8h' });
  return res.status(200).json({ success: true, token, officer: user, expiresIn: 28800 });
});

// POST /api/auth/demo-login (Backwards-compatible demo login lookup from DB)
router.post('/demo-login', (req, res) => {
  const { officerId, method = 'parichay-id' } = req.body ?? {};

  if (!officerId || !['parichay-id', 'mobile-otp'].includes(method)) {
    return res.status(400).json({ error: 'A valid demo officer and authentication method are required.' });
  }

  // Lookup by role shortcut or id in DB
  const roleMapping: Record<string, string> = {
    jso: 'PARICHAY_1042_NSSO',
    sso: 'PARICHAY_2088_NSSO',
    'assistant-director': 'PARICHAY_3612_ISS',
    director: 'PARICHAY_4820_ISS',
    'joint-director': 'PARICHAY_5914_ISS',
    'deputy-director': 'PARICHAY_6120_ISS',
  };

  const targetParichayId = roleMapping[officerId] || officerId;
  let user = userDb.getUserByParichayId(targetParichayId) || userDb.getUserById(officerId);

  // If not a known role shortcut and not an existing user in DB, reject invalid ID
  if (!user && !roleMapping[officerId]) {
    return res.status(400).json({ error: 'A valid demo officer and authentication method are required.' });
  }

  if (!user) {
    user = userDb.registerUser({
      name: officerId.toUpperCase(),
      designation: officerId,
      parichayId: `PARICHAY_${officerId.toUpperCase()}`,
    });
  }

  const signingSecret = process.env.JWT_SECRET || 'statskill_default_jwt_secret_dev_2026';
  const token = jwt.sign({ ...user, authMethod: method }, signingSecret, { expiresIn: '8h' });
  return res.status(200).json({ success: true, token, officer: user, expiresIn: 28800 });
});

// POST /api/auth/custom-login (Direct dynamic profile login)
router.post('/custom-login', (req, res) => {
  const { officer, method = 'parichay-id' } = req.body ?? {};

  if (!officer || !officer.designation || !officer.name) {
    return res.status(400).json({ error: 'A valid officer profile containing at least name and designation is required.' });
  }

  if (!['parichay-id', 'mobile-otp'].includes(method)) {
    return res.status(400).json({ error: 'A valid authentication method (parichay-id or mobile-otp) is required.' });
  }

  // Check if already in DB or register
  let user = officer.parichayId ? userDb.getUserByParichayId(officer.parichayId) : undefined;
  if (!user) {
    user = userDb.registerUser(officer);
  } else {
    user = userDb.updateUser(user.id, officer) || user;
  }

  const signingSecret = process.env.JWT_SECRET;
  if (!signingSecret) {
    return res.status(503).json({ error: 'Authentication signing secret is not configured.' });
  }

  const token = jwt.sign({ ...user, authMethod: method }, signingSecret, { expiresIn: '8h' });
  return res.status(200).json({ success: true, token, officer: user, expiresIn: 28800 });
});

// PUT /api/auth/profile/:id (Update officer proficiencies or metadata)
router.put('/profile/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body ?? {};

  const updated = userDb.updateUser(id, updates);
  if (!updated) {
    return res.status(404).json({ error: 'Officer profile not found.' });
  }

  return res.status(200).json({ success: true, officer: updated });
});

export default router;
