import { Request, Response, NextFunction } from 'express';
import { RecaptchaV3 } from 'express-recaptcha';

// Initialize reCAPTCHA
const recaptcha = new RecaptchaV3(
  process.env.RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
  process.env.RECAPTCHA_SECRET_KEY || '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe'
);

// Middleware to verify reCAPTCHA
export const verifyRecaptcha = (req: Request, res: Response, next: NextFunction) => {
  // Skip reCAPTCHA validation in development mode
  if (process.env.NODE_ENV === 'development') {
    return next();
  }

  // Use reCAPTCHA middleware
  return recaptcha.middleware.verify(req, res, next);
};

// Middleware to render reCAPTCHA (for frontend integration)
export const renderRecaptcha = recaptcha.middleware.render;

// Helper function to check reCAPTCHA validation result
export const checkRecaptchaValidation = (req: Request): boolean => {
  if (process.env.NODE_ENV === 'development') {
    return true; // Always pass in development
  }
  
  return !!(req.recaptcha && !req.recaptcha.error);
}; 