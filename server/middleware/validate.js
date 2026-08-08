import { validationResult } from 'express-validator';

// Shared handler that turns express-validator results into the same JSON error
// shape the client already renders ({ message }).
export const validate = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();
  const errors = result.array();
  return res.status(400).json({ message: errors[0].msg, errors });
};
