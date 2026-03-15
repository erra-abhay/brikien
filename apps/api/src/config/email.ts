import nodemailer from 'nodemailer';

const host = process.env.SMTP_HOST || 'localhost';
const port = parseInt(process.env.SMTP_PORT || '1025', 10);

export const transporter = nodemailer.createTransport({
  host,
  port,
  secure: false,
  auth: undefined, // Mailpit needs no auth
});

transporter.verify((error) => {
  if (error) {
    console.error('❌ Mailpit connection error:', error);
  } else {
    console.log(`✅ Mailpit connected at ${host}:${port}`);
  }
});
