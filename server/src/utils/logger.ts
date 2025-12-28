import chalk from 'chalk';
import { Log } from '../models/log.model';

export default class Logger {
    private static async saveToDB(level: string, message: string, meta?: any) {
        try {
            // Only save warn and error logs to DB to avoid spam
            if (level === 'error' || level === 'warn') {
                const logEntry = new Log({
                    level,
                    message,
                    meta
                });
                await logEntry.save();
            }
        } catch (err) {
            console.error(chalk.red('[LOGGER ERROR] Failed to save log to DB:'), err);
        }
    }

    static info(text: string) {
        console.log(`${chalk.blue('[INFO]')} ${chalk.gray(new Date().toLocaleTimeString())} : ${text}`);
    }

    static warn(text: string) {
        console.log(`${chalk.yellow('[WARN]')} ${chalk.gray(new Date().toLocaleTimeString())} : ${text}`);
        this.saveToDB('warn', text);
    }

    static error(text: string, meta?: any) {
        console.log(`${chalk.red('[ERROR]')} ${chalk.gray(new Date().toLocaleTimeString())} : ${text}`);
        if (meta) {
            console.error(meta);
        }
        this.saveToDB('error', text, meta);
    }

    static success(text: string) {
        console.log(`${chalk.green('[SUCCESS]')} ${chalk.gray(new Date().toLocaleTimeString())} : ${text}`);
    }

    static debug(text: string) {
        console.log(`${chalk.magenta('[DEBUG]')} ${chalk.gray(new Date().toLocaleTimeString())} : ${text}`);
    }
}
