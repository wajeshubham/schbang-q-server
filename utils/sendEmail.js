import { createTransport } from "nodemailer";

/**
 *
 * @param {{
 *      email: string | string[];
 *      subject: string;
 *      text: string;
 * }} options
 */
const sendEmail = async (options) => {
  let transporter = createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mail = {
    from: "wj.shubham@gmail.com",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mail);
};

export default sendEmail;
