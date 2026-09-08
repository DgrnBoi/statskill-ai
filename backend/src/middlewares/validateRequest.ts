import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

export function validateBody(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          error: 'Invalid request payload format.',
          details: err.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
        });
      }
      return res.status(400).json({ error: 'Failed to validate request body.' });
    }
  };
}

// Pre-defined Zod Schemas for Authentication & User Registration
export const RegisterUserSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  designation: z.string().min(2, 'Designation is required'),
  division: z.string().optional(),
  cadre: z.string().optional(),
  parichayId: z.string().optional(),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  mobile: z.string().optional(),
  location: z.string().optional(),
  experienceYears: z.number().optional(),
});

export const LoginUserSchema = z.object({
  identifier: z.string().min(1, 'Identifier is required'),
  method: z.enum(['parichay-id', 'mobile-otp']).optional().default('parichay-id'),
});

export const DemoLoginSchema = z.object({
  officerId: z.string().min(1, 'Officer ID is required'),
  method: z.enum(['parichay-id', 'mobile-otp']).optional().default('parichay-id'),
});
