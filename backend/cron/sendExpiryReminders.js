import cron from 'node-cron';
import monthlyPass from '../model/monthlyPass.js'; // ✅ Your model name is lowercase
import { sendWhatsAppTemplate } from '../utils/sendWhatsAppTemplate.js';

cron.schedule('0 10 * * *', async () => {
  const today = new Date();
  const targetDate = new Date();
  targetDate.setDate(today.getDate() + 2);

  try {
    const expiringSoon = await monthlyPass.find({ // ✅ Use the correct model name
      endDate: {
        $gte: new Date(targetDate.setHours(0, 0, 0, 0)),
        $lte: new Date(targetDate.setHours(23, 59, 59, 999))
      }
    });

    for (const pass of expiringSoon) {
      await sendWhatsAppTemplate(pass.mobileNumber, 'pass_expiry_reminder', [
        pass.name,
        pass.vehicleNumber,
        pass.endDate.toDateString()
      ]);
    }

    console.log(`[CRON] Notified ${expiringSoon.length} users about pass expiry on ${targetDate.toDateString()}`);

  } catch (error) {
    console.error('[CRON] Error in sending expiry reminders:', error.message);
  }
});
