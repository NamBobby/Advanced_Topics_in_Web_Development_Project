require("dotenv").config();
const nodemailer = require('nodemailer');

const sendMail = async (mailOptions) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.mail.yahoo.com',
      port: 465,
      secure: true, // or 'ssl'
      auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_EMAIL_PASSWORD
      },
      tls: {
        minVersion: 'TLSv1.2'
      }
    });

    // Convert the to field to an array if it's a string
    if (typeof mailOptions.to === 'string') {
      mailOptions.to = [mailOptions.to];
    }

    await transporter.sendMail(mailOptions);
    return { 
        EC: 0,
        EM: "Email sent successfully" };
  } catch (error) {
    console.log(error);
    return { EC: 3, EM: "Error sending email" };
  }
};


const sendOTP = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: 'Verify Your Email',
      html: `<p>Enter your OTP: ${otp} to verify your email address and complete the process </p><p> This code <b>expires in 10 minutes</b></p>`,
    };

    await sendMail(mailOptions);
    return { 
        EC: 0,
        EM: "OTP sent successfully" };
  } catch (error) {
    console.log(error);
    return { EC: 3, EM: "Error sending OTP" };
  }
};

module.exports = { sendMail, sendOTP };