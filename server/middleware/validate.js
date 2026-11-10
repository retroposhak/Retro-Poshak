import { ApiError } from '../utils/ApiError.js';

/**
 * Usage:  router.post('/login', validate({ body: loginSchema }), handler)
 * Runs the Zod schema against req[part] and either replaces it with the
 * parsed (typed, trimmed) value or throws a 400 with field-level errors.
 */
export const validate = (schemas) => (req, _res, next) => {
  try {
    for (const part of ['body', 'query', 'params']) {
      if (schemas[part]) {
        req[part] = schemas[part].parse(req[part]);
      }
    }
    next();
  } catch (err) {
    if (err?.issues) {
      const details = Object.fromEntries(
        err.issues.map((i) => [i.path.join('.'), i.message])
      );
      return next(ApiError.badRequest('Validation failed', details));
    }
    next(err);
  }
};