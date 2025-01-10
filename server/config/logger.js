/**
 * @file utils/logger.js
 * @description This module creates and configures a Winston logger instance to log messages with different log levels.
 * The logger is set up to output logs to the console with timestamp and colored log levels for better readability.
 *
 * @module logger
 */

import { createLogger, transports, format } from 'winston';

/**
 * Winston logger instance configured with the following:
 * - Log messages are colorized for readability.
 * - Timestamps are included in the log messages.
 * - Custom log format that combines timestamp, log level, and the message.
 * - Output is sent to the console.
 *
 * @constant {object} logger - The logger instance used for logging messages in the application.
 *
 * @example
 * // Example of using the logger in the code:
 * logger.info('This is an info message');
 * logger.error('This is an error message');
 */
const logger = createLogger({
  format: format.combine(
    format.colorize(), // Colors the log level (info, error, etc.)
    format.timestamp(), // Adds a timestamp to the log entry
    format.printf(
      ({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`
    ) // Custom log format with timestamp, level, and message
  ),
  transports: [new transports.Console()] // Output to the console
});

export default logger;
