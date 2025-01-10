/**
 * @file middlewares/requestLogger.js
 * @description Middleware to log incoming requests and their responses using Winston logger.
 *
 * @module requestLogger
 */

import logger from '../config/logger.js';

/**
 * Logs incoming HTTP requests and their corresponding responses.
 *
 * @function requestLogger
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 *
 * @example
 * app.use(requestLogger);
 */
export const requestLogger = (req, res, next) => {
  // Log the incoming request
  logger.info(`Incoming request: ${req.method} ${req.originalUrl}`);

  // Log the response status when the response finishes
  res.on('finish', () => {
    logger.info(`Response status: ${res.statusCode}`);
  });   

  // Proceed to the next middleware
  next();
};
