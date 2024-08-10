import { createLogger, transports, format } from 'winston';
import * as dotenv from 'dotenv';

dotenv.config();

const logger = createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: format.combine(
        format.timestamp(),
        format.json(),
        format.prettyPrint()
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: process.env.LOG_FILE_PATH || 'server.log' })
    ]
});

export default logger;
