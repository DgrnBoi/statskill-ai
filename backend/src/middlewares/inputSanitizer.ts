import { Request, Response, NextFunction } from 'express';

function sanitizeString(str: string, maxLength: number = 500): string {
  if (typeof str !== 'string') return '';
  let clean = str.replace(/<[^>]*>?/gm, ''); // strip HTML / script tags
  clean = clean.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ''); // strip null bytes & control characters
  return clean.substring(0, maxLength).trim();
}

function sanitizeObject(obj: any, maxDepth: number = 5): any {
  if (!obj || maxDepth <= 0) return obj;
  if (typeof obj === 'string') return sanitizeString(obj);
  if (Array.isArray(obj)) return obj.map((item) => sanitizeObject(item, maxDepth - 1));
  if (typeof obj === 'object') {
    const sanitized: Record<string, any> = {};
    for (const [key, val] of Object.entries(obj)) {
      sanitized[key] = sanitizeObject(val, maxDepth - 1);
    }
    return sanitized;
  }
  return obj;
}

export function inputSanitizerMiddleware(req: Request, _res: Response, next: NextFunction) {
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeObject(req.query);
  }

  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }

  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeObject(req.params);
  }

  next();
}
