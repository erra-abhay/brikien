import { transporter } from '../config/email';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (options: EmailOptions) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@brikienlabs.tech',
      to: options.to,
      subject: options.subject,
      html: options.html
    });
    console.log(`✅ Email sent to ${options.to}. Message ID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`❌ Error sending email to ${options.to}:`, error);
    throw new Error('Failed to send email');
  }
};
