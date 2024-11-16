import puppeteer from 'puppeteer';
import notifier from 'node-notifier';
import { createLogger, format, transports } from 'winston';
import dotenv from 'dotenv';
import { checkAvailability } from './appointment.js';
import { config } from './config.js';

dotenv.config();

const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.simple()
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'appointment-bot.log' })
  ]
});

async function main() {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null
    });

    logger.info('Starting VFS appointment check...');
    
    while (true) {
      try {
        const available = await checkAvailability(browser);
        
        if (available) {
          notifier.notify({
            title: 'VFS Appointment Available!',
            message: 'An appointment slot is available. Check the browser!',
            sound: true
          });
          logger.info('Appointment slot found!');
        }
        
        // Wait for 5 minutes before checking again
        await new Promise(resolve => setTimeout(resolve, 300000));
      } catch (error) {
        logger.error('Error during appointment check:', error);
        await new Promise(resolve => setTimeout(resolve, 60000));
      }
    }
  } catch (error) {
    logger.error('Fatal error:', error);
    process.exit(1);
  }
}