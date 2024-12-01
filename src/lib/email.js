import nodemailer from "nodemailer";

// Create a reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail", // You can change this to your preferred email provider
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASS, // Your email password or app-specific password
    },
  });
};

export default createTransporter;
