import cron from 'cron';
import Subscriptions from '../models/Subscriptions.js';
import ejs from "ejs";
import path from 'path';
import { fileURLToPath } from "url";
import transporter, { mailOptionsHelper } from "../config/nodemailer.js";
import { MESSAGES } from '../constant/messages.js';
import { AppConstants } from '../constant/appConstants.js';

export const subscriptionUpdateOnNextCycle = async (subscription) => {
  try {
    const now = new Date();
    const start = new Date(subscription.updatedAt);

    const renewalDate = new Date(start);
    renewalDate.setDate(
      renewalDate.getDate() + subscription.interval_count
    );

    const diffMs = renewalDate - now;
    const diffMinutes = diffMs / (1000 * 60);

    // console.log('diffMinutes', diffMinutes);

    // if within 24 hrs
    if (diffMinutes <= 24 * 60) {

      // mail already sent or not        
      const alreadySent =
        subscription.lastReminderSentAt &&
        new Date(subscription.lastReminderSentAt).toDateString() === now.toDateString();

      // console.log('alreadySent', alreadySent); 

      // mail
      if (!alreadySent) {
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        const templatePath = path.join(__dirname, "../utils/templates/subscriptionReminder.ejs");

        const html = await ejs.renderFile(templatePath, {
          user: subscription.userId,
          subscription: subscription
        });

        const mailOptions = mailOptionsHelper(
          process.env.SENDER_EMAIL,
          subscription.userId.email,
          MESSAGES.NODEMAILER.SUBSCRIPTION.SUBJECT_REMINDER,
          html,
        )

        await transporter.sendMail(mailOptions);

        // update subscriptions
        subscription.lastReminderSentAt = now;
        await subscription.save();
        // console.log('subscription', subscription);
      }
    }

    return subscription;
  }
  catch (error) {
    console.error("Mail/Subscription Error:", error.message);
  }
}

// Task for renewal mail for subscriptions
const task = async () => {
  const activeSubscriptions = await Subscriptions
    .find({
      subscriptionStatus: AppConstants.SubscriptionStatus.Active,
    })
    .populate("userId");

  // console.log('activeSubscriptions', activeSubscriptions);

  for (let subscription of activeSubscriptions) {
    await subscriptionUpdateOnNextCycle(subscription);
  }
};

export const cronJob = async () => {

  // Cron Job for task
  const job = cron.CronJob.from({
    cronTime: "0 9 * * *",
    onTick: task,
    start: true,
  })

}
