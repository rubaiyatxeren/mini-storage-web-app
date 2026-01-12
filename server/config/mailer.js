const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendWelcomeEmail = async (email, username) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn("⚠️ Email configuration missing - skipping welcome email");
      return null;
    }

    const mailOptions = {
      from: `"Storagify - File Upload App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to Storagify - File Upload App!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4CAF50;">🎉 Welcome to Storagify - File Upload App, ${username}!</h2>
          <p>Dear ${username},</p>
          <p>Thank you for registering with our File Upload Service. You can now:</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>✨ Features Available:</h3>
            <ul>
              <li>📁 Upload files up to 50MB</li>
              <li>🖼️ Upload images</li>
              <li>🎥 Upload videos</li>
              <li>📧 Get email notifications for uploads</li>
              <li>☁️ Secure Cloudinary storage</li>
            </ul>
          </div>
          
          <p>Start uploading your files now!</p>
          
          <div style="margin-top: 30px; padding: 15px; background-color: #e8f5e9; border-radius: 5px;">
            <p><strong>Need help?</strong> Contact our support team.</p>
          </div>
          
          <p style="color: #666; font-size: 12px; margin-top: 20px; border-top: 1px solid #eee; padding-top: 10px;">
            This is an automated notification. Please do not reply to this email.
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Welcome email sent to ${email}`);
    console.log("Email sent:", info.response);
    return info;
  } catch (error) {
    console.error("❌ Error sending welcome email:", error.message);
    return null;
  }
};

const sendUploadedNotification = async (email, fileDetails, username) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn("⚠️ Email configuration missing - skipping welcome email");
      return null;
    }

    const mailOptions = {
      from: `"Storagify - File Upload App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "File Uploaded Successfully!",
      html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4CAF50;">✅ File Successfully Uploaded!</h2>
          <p>Dear ${username},</p>
          <p>Your file "${
            fileDetails.name.split(".")[0]
          }" has been successfully uploaded to Cloudinary.</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>📄 File Details</h3>
            <ul style="list-style: none; padding: 0;">
              <li style="margin: 10px 0;"><strong>📝 File Name:</strong> ${
                fileDetails.name
              }</li>
              <li style="margin: 10px 0;"><strong>📏 File Size:</strong> ${(
                fileDetails.size / 1024
              ).toFixed(2)} KB</li>
              <li style="margin: 10px 0;"><strong>📎 File Format:</strong> ${
                fileDetails.format
              }</li>
              <li style="margin: 10px 0;"><strong>⏰ Upload Time:</strong> ${new Date().toLocaleString()}</li>
              <li style="margin: 10px 0;"><strong>🔗 File URL:</strong> 
                <a href="${
                  fileDetails.url
                }" style="color: #2196F3; text-decoration: none;">
                  Click here to access your file
                </a>
              </li>
            </ul>
          </div>
          
          <p style="color: #666; font-size: 12px; margin-top: 20px; border-top: 1px solid #eee; padding-top: 10px;">
            This is an automated notification. Please do not reply to this email.
          </p>
        </div>
        `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Uploaded notification sent to ${email}`);
    return info;
  } catch (error) {
    console.error("❌ Error sending uploaded notification:", error.message);
    return null;
  }
};

module.exports = { sendWelcomeEmail, sendUploadedNotification };
