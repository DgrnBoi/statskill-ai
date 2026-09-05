import { Request, Response, NextFunction } from 'express';

function sanitizeString(str: string, maxLength: number = 100): string {
  if (typeof str !== 'string') return '';
  let clean = str.replace(/<[^>]*>?/gm, ''); // strip HTML / script tags
  clean = clean.replace(/[\x00-\x1F\x7F]/g, ''); // strip control characters
  return clean.substring(0, maxLength).trim();
}

export function inputSanitizerMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.query && typeof req.query === 'object') {
    const sanitizedQuery: Record<string, any> = {};
    for (const [key, val] of Object.entries(req.query)) {
      if (typeof val === 'string') {
        sanitizedQuery[key] = sanitizeString(val, key === 'q' ? 100 : 200);
      } else {
        sanitizedQuery[key] = val;
      }
    }
    req.query = sanitizedQuery;
  }

  if (req.body && typeof req.body === 'object') {
    for (const [key, val] of Object.entries(req.body)) {
      if (typeof val === 'string' && key.toLowerCase().includes('search')) {
        req.body[key] = sanitizeString(val, 100);
      }
    }
  }

  next();
}
