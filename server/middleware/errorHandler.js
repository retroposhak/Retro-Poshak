import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

export function errorHandler(err, _req, res, _next) {
  // Mongoose validation
  if (err?.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      details: Object.fromEntries(
        Object.entries(err.errors).map(([k, v]) => [k, v.message])
      ),
    });
  }

  // Mongoose duplicate key
  if (err?.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'Duplicate value',
      details: err.keyValue || null,
    });
  }

  // Invalid ObjectId
  if (err?.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid ${err.path}`,
    });
  }

  const status = err instanceof ApiError ? err.statusCode : 500;
  const message =
    err instanceof ApiError || env.isProd
      ? err.message
      : err.message || 'Unexpected error';

  if (status >= 500) {
    console.error('[error]', err);
  }

  res.status(status).json({
    success: false,
    message,
    details: err instanceof ApiError ? err.details : null,
    ...(env.isProd ? {} : { stack: err.stack }),
  });
}