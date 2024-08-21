import rateLimit from 'express-rate-limit';

export const rateLimiterUsingThirdParty = rateLimit({
  windowMs: 60 * 1000, // 1 minute in milliseconds
  max: 1000,
  message: 'Please try again later, To many request', 
  headers: true,
});

// ====================================================================================================
// ====================================================================================================
