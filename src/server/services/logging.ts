import winston from "winston";
import dotenv from "dotenv";

dotenv.config();

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
    ),
    transports: [
        new winston.transports.File({ filename: "logs/error.log", level: "error" }),
        new winston.transports.File({ filename: "logs/combined.log" }),
    ]
});

if (process.env.NODE_ENV === "DEVELOPMENT") {
    logger.add(new winston.transports.Console({
        format: winston.format.cli(),
        level: "verbose"
    }));
}

function logHTTPRequest(req, res, next) {
    logger.debug(`${req.method} ${req.url}`);
    next();
}

export { logger, logHTTPRequest };
export default logger;