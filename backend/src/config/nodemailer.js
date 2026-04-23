import nodemailer from "nodemailer";

// console.log("SMTP USER:", process.env.SMTP_USER);
// console.log("SMTP PASS:", process.env.SMTP_PASS);

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const mailOptionsHelper = (sender, receiver, subject, text) => {
  const mailOptions = {
    from: sender,
    to: receiver,
    subject: subject,
    text: text,
  };

  return mailOptions;
};

export default transporter;
