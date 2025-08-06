const { body, validationResult } = require('express-validator');

exports.validateProjectUpdate = [
  body('title')
    .notEmpty()
    .withMessage('Title is required'),

  body('description')
    .notEmpty()
    .withMessage('Description is required'),

  body('status')
    .optional()
    .isIn(['pending', 'in progress', 'completed'])
    .withMessage('Status must be one of: pending, in progress, completed'),

  body('client')
    .notEmpty()
    .withMessage('Client ID is required'),

  // Validation error handler
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
