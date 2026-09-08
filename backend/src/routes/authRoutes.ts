import express from 'express';
import jwt from 'jsonwebtoken';
import { userDb, UserRecord } from '../db/UserDatabase';
import { getJwtSecret, requireAuth, AuthenticatedRequest } from '../middlewares/authMiddleware';
import { validateBody, RegisterUserSchema, LoginUserSchema, DemoLoginSchema } from '../middlewares/validateRequest';

const router = express.Router();

/**
 * GET /api/auth/users
 * Returns sanitized directory listing of registered officers.
 * Sensitive PII (raw mobile numbers and personal emails) is stripped to ensure data minimization (DPDP Act 2023).
 */
router.get('/users', (req, res) => {
  const { division, cadre, search } = req.query;
  const users = userDb.getAllUsers({
    division: typeof division === 'string' ? division : undefined,
    cadre: typeof cadre === 'string' ? cadre : undefined,
    search: typeof search === 'string' ? search : undefined,
  });

  const sanitizedUsers = users.map((u) => ({
    id: u.id,
    name: u.name,
    designation: u.designation,
    division: u.division,
    cadre: u.cadre,
    location: u.location,
    parichayId: u.parichayId,
    experienceYears: u.experienceYears,
  }));

  return res.status(200).json({ success: true, count: sanitizedUsers.length, users: sanitizedUsers });
});

/**
 * GET /api/auth/user/:id
 * Get specific officer record.
 */
router.get('/user/:id', (req, res) => {
  const { id } = req.params;
  const user = userDb.getUserById(id) || userDb.getUserByParichayId(id);
  if (!user) {
    return res.status(404).json({ error: 'Officer profile not found.' });
  }

  const sanitized = {
    id: user.id,
    name: user.name,
    designation: user.designation,
    division: user.division,
    cadre: user.cadre,
    location: user.location,
    parichayId: user.parichayId,
    experienceYears: user.experienceYears,
    proficiency: user.proficiency,
  };

  return res.status(200).json({ success: true, user: sanitized });
});

/**
 * POST /api/auth/register
 * Registers a new officer with Zod validation & JWT issuance.
 */
router.post('/register', validateBody(RegisterUserSchema), (req, res) => {
  const { name, designation, division, cadre, parichayId, email, mobile, location, experienceYears } = req.body;

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

  const secret = getJwtSecret();
  const token = jwt.sign({ id: newUser.id, parichayId: newUser.parichayId, name: newUser.name, designation: newUser.designation, division: newUser.division, cadre: newUser.cadre, authMethod: 'parichay-id' }, secret, { expiresIn: '8h' });

  return res.status(201).json({ success: true, token, officer: newUser, expiresIn: 28800 });
});

/**
 * POST /api/auth/login
 * Simulates Jan Parichay SSO authentication (parichay-id or mobile-otp).
 */
router.post('/login', validateBody(LoginUserSchema), (req, res) => {
  const { identifier, method } = req.body;

  const user = userDb.getUserByParichayId(identifier) || userDb.getUserByEmail(identifier) || userDb.getUserByMobile(identifier) || userDb.getUserById(identifier);

  if (!user) {
    return res.status(404).json({ error: 'No registered officer found with the provided credentials.' });
  }

  const secret = getJwtSecret();
  const token = jwt.sign({ id: user.id, parichayId: user.parichayId, name: user.name, designation: user.designation, division: user.division, cadre: user.cadre, authMethod: method }, secret, { expiresIn: '8h' });

  return res.status(200).json({ success: true, token, officer: user, expiresIn: 28800 });
});

/**
 * POST /api/auth/demo-login
 * Fast demo login lookup supporting Jan Parichay SSO simulated presets.
 */
router.post('/demo-login', validateBody(DemoLoginSchema), (req, res) => {
  const { officerId, method } = req.body;

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

  const secret = getJwtSecret();
  const token = jwt.sign({ id: user.id, parichayId: user.parichayId, name: user.name, designation: user.designation, division: user.division, cadre: user.cadre, authMethod: method }, secret, { expiresIn: '8h' });

  return res.status(200).json({ success: true, token, officer: user, expiresIn: 28800 });
});

/**
 * POST /api/auth/custom-login
 * Dynamic profile custom login for testing multi-role scenarios.
 */
router.post('/custom-login', (req, res) => {
  const { officer, method = 'parichay-id' } = req.body ?? {};

  if (!officer || !officer.designation || !officer.name) {
    return res.status(400).json({ error: 'A valid officer profile containing at least name and designation is required.' });
  }

  let user = officer.parichayId ? userDb.getUserByParichayId(officer.parichayId) : undefined;
  if (!user) {
    user = userDb.registerUser(officer);
  } else {
    user = userDb.updateUser(user.id, officer) || user;
  }

  const secret = getJwtSecret();
  const token = jwt.sign({ id: user.id, parichayId: user.parichayId, name: user.name, designation: user.designation, division: user.division, cadre: user.cadre, authMethod: method }, secret, { expiresIn: '8h' });

  return res.status(200).json({ success: true, token, officer: user, expiresIn: 28800 });
});

/**
 * PUT /api/auth/profile/:id
 * Protected endpoint: updates officer profile or proficiencies.
 */
router.put('/profile/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const updates = req.body ?? {};

  // Verify that authenticated user matches profile ID or is authorized
  if (req.user?.id !== id && req.user?.parichayId !== id) {
    const isRoleMatch = req.user?.cadre?.toLowerCase().includes('director') || req.user?.designation?.toLowerCase().includes('director');
    if (!isRoleMatch) {
      return res.status(403).json({ error: 'Forbidden. You may only update your own officer profile.' });
    }
  }

  const updated = userDb.updateUser(id, updates);
  if (!updated) {
    return res.status(404).json({ error: 'Officer profile not found.' });
  }

  return res.status(200).json({ success: true, officer: updated });
});

export default router;
