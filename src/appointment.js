import { config } from './config.js';

export async function checkAvailability(browser) {
  const page = await browser.newPage();
  
  try {
    // Navigate to VFS login page
    await page.goto('https://visa.vfsglobal.com/mar/en/nld/login');
    
    // Login
    await page.waitForSelector('#mat-input-0');
    await page.type('#mat-input-0', process.env.VFS_EMAIL);
    await page.type('#mat-input-1', process.env.VFS_PASSWORD);
    await page.click('.mat-focus-indicator.mat-raised-button');
    
    // Wait for navigation and check appointments
    await page.waitForNavigation();
    await page.goto('https://visa.vfsglobal.com/mar/en/nld/book-an-appointment');
    
    // Select visa center
    await page.waitForSelector('.mat-select-trigger');
    await page.click('.mat-select-trigger');
    await page.waitForSelector('mat-option');
    
    // Select Rabat or Casablanca based on config
    const centers = await page.$$('mat-option');
    for (const center of centers) {
      const text = await center.evaluate(el => el.textContent);
      if (text.includes(config.preferredCenter)) {
        await center.click();
        break;
      }
    }
    
    // Check for available slots
    await page.waitForSelector('.appointment-slots');
    const slotsAvailable = await page.evaluate(() => {
      const slots = document.querySelectorAll('.slot-available');
      return slots.length > 0;
    });
    
    return slotsAvailable;
  } finally {
    await page.close();
  }
}