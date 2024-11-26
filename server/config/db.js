import mongoose from 'mongoose';
import logger from './logger.js';

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        logger.info("Connected to MongoDB successfully");
    } catch (error) {
        logger.error("MongoDB connection error:", error);
        // Exit process with failure
        process.exit(1);
    }
};

// Optional: Add mongoose connection event listeners
mongoose.connection.on('disconnected', () => {
    logger.warn('Lost MongoDB connection');
});

mongoose.connection.on('reconnected', () => {
    logger.info('Reconnected to MongoDB');
});