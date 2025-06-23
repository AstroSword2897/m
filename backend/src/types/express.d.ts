import { Request } from 'express'

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
      };
      recaptcha?: {
        error?: string;
        data?: any;
      };
    }
  }
} 