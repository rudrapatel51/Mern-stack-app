import logger from '../config/logger.js';

export const requestLogger = (req, res, next) => {
    logger.info(`Incoming request: ${req.method} ${req.originalUrl}`);
    res.on('finish', () => {
        logger.info(`Response status: ${res.statusCode}`);
    });
    next();
};
