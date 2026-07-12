const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"Learn With Resma" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
};

const emailTemplates = {
  welcome: (name) => ({
    subject: 'Welcome to Learn With Resma!',
    html: `<h1>Welcome ${name}!</h1><p>Thank you for joining Learn With Resma. Start your English learning journey today!</p>`,
  }),
  passwordReset: (name, resetUrl) => ({
    subject: 'Password Reset Request',
    html: `<h1>Hello ${name}</h1><p>Click the link below to reset your password:</p><a href="${resetUrl}">${resetUrl}</a><p>This link expires in 10 minutes.</p>`,
  }),
  certificate: (name, courseName) => ({
    subject: 'Certificate of Completion',
    html: `<h1>Congratulations ${name}!</h1><p>You have completed <strong>${courseName}</strong>. Your certificate is ready!</p>`,
  }),
};

module.exports = { sendEmail, emailTemplates };
