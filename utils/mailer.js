const nodemailer = require('nodemailer');
require('dotenv').config();

// Configure nodemailer with your email service credentials
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SOFTWARE_EMAIL,
    pass: process.env.SOFTWARE_EMAIL_PASS,
  },
});

const sendEmailToBuyer = async (buyerEmail, productName, auctionDetails) => {
  try {
    const mailOptions = {
      from: process.env.SOFTWARE_EMAIL,
      to: buyerEmail,
      subject: 'Congratulations! You won the auction!',
      text: `Dear Buyer,\n\nCongratulations! You have won the auction for the product "${productName}" in the auction below: \n\n${auctionDetails}\n\nThank you for participating!\n\nBest regards,\nAuction House`,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error.message);
    throw error;
  }
};

module.exports = { sendEmailToBuyer };
