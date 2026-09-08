import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedUserPayload {
  id: string;
  parichayId: string;
  name: string;
  designation: string;
  division: string;
  cadre: string;
  role?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUserPayload;
}

/**
 * Resolves JWT Secret securely.
 * Enforces mandatory process.env.JWT_SECRET in production.
 */
export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (process.env.NODE_ENV === 'production' && (!secret || secret.trim() === '' || secret.includes('default'))) {
    throw new Error('[CRITICAL SECURITY ERROR] Mandatory JWT_SECRET environment variable is missing or insecure in production environment.');
  }
  return secret || 'statskill_dev_jwt_secret_key_2026_secured';
}

/**
 * Middleware: Enforces valid JWT token on protected endpoints.
 */
export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Authentication required. Missing or malformed Authorization header.',
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const secret = getJwtSecret();
    const decoded = jwt.verify(token, secret) as AuthenticatedUserPayload;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      error: 'Invalid, expired, or untrusted authentication token.',
    });
  }
}

/**
 * Middleware: Enforces specific role or cadre permissions.
 */
export function requireRole(allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required prior to role check.' });
    }

    const userCadre = req.user.cadre || '';
    const userDesig = req.user.designation || '';
    const userRole = req.user.role || '';

    const hasPermission = allowedRoles.some((role) =>
      userCadre.toLowerCase().includes(role.toLowerCase()) ||
      userDesig.toLowerCase().includes(role.toLowerCase()) ||
      userRole.toLowerCase() === role.toLowerCase()
    );

    if (!hasPermission) {
      return res.status(403).json({
        error: `Access denied. Authorized role required (${allowedRoles.join(', ')}).`,
      });
    }

    next();
  };
}
