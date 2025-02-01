const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  //Create a transporter
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //Define the email options
  const mailOptions = {
    from: 'Kennedy Phinias: <kenny@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  //Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
