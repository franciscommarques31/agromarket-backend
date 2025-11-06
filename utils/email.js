const nodemailer = require("nodemailer");


const FRONTEND_URL = process.env.NODE_ENV === "production"
  ? process.env.FRONTEND_URL_PROD
  : process.env.FRONTEND_URL_DEV;


const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS
  }
});


const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"AgroMarket" <noreply@agromarket.com>`,
      to,
      subject,
      html
    });
    console.log(`✅ Email enviado para ${to}`);
  } catch (error) {
    console.error("❌ Erro ao enviar email:", error);
  }
};


const sendResetPasswordEmail = async (user, token) => {
  const resetUrl = `${FRONTEND_URL}/reset-password/${token}`;
  const html = `
    <p>Olá ${user.name},</p>
    <p>Recebemos um pedido para redefinir a sua password.</p>
    <p>Clica no link abaixo para criar uma nova password:</p>
    <a href="${resetUrl}">Redefinir Password</a>
    <p>Se não pediste para alterar a password, ignora este email.</p>
  `;
  await sendEmail({ to: user.email, subject: "Redefinição de Password", html });
};

module.exports = { sendEmail, sendResetPasswordEmail };
