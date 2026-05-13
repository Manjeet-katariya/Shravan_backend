const nodemailer = require('nodemailer');

// SMTP Configuration for Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'sparchitects93@gmail.com', // Your Gmail
    pass: 'himk idwt vpkg rsae' // App password (spaces removed)
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify SMTP connection
const verifySMTP = async () => {
  try {
    await transporter.verify();
    console.log('✅ SMTP Server is ready to send emails');
    return true;
  } catch (error) {
    console.error('❌ SMTP Verification failed:', error.message);
    return false;
  }
};

// Send Contact Form Notification to Admin
const sendContactNotification = async (contactData) => {
  try {
    const { name, email, phone, subject, message, projectType, budget } = contactData;
    
    const mailOptions = {
      from: '"Shravan Puri architects studio" <sparchitects93@gmail.com>',
      to: 'sparchitects93@gmail.com', // Admin email
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #a68a6b; border-bottom: 2px solid #a68a6b; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Customer Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Name:</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Email:</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Phone:</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${phone || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Project Type:</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${projectType || 'Not specified'}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Budget:</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${budget || 'Not specified'}</td>
              </tr>
            </table>
          </div>
          
          <div style="background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Subject: ${subject}</h3>
            <p style="color: #555; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding: 20px; background: #f5f5f5; border-radius: 8px;">
            <p style="color: #777; margin: 0;">Received on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
            <p style="color: #a68a6b; font-weight: bold; margin: 10px 0 0 0;">Shravan Puri architects studio</p>
          </div>
        </div>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Contact notification email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Failed to send contact notification:', error.message);
    return { success: false, error: error.message };
  }
};

// Send Estimate Notification to Admin
const sendEstimateNotification = async (estimateData) => {
  try {
    const { 
      customerName, email, phone, projectType, 
      builtUpArea, qualityLevel, calculatedEstimate, 
      city, location, customerBudget 
    } = estimateData;
    
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(amount);
    };
    
    const mailOptions = {
      from: '"Shravan Puri architects studio" <sparchitects93@gmail.com>',
      to: 'sparchitects93@gmail.com', // Admin email
      subject: `New Estimate Request from ${customerName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #a68a6b; border-bottom: 2px solid #a68a6b; padding-bottom: 10px;">
            New Estimate Request
          </h2>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Customer Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Name:</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${customerName}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Email:</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Phone:</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${phone || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Location:</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${city || ''} ${location || ''}</td>
              </tr>
            </table>
          </div>
          
          <div style="background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Project Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Project Type:</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${projectType}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Built-up Area:</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${builtUpArea} sq.ft</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Quality Level:</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${qualityLevel}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Customer Budget:</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${customerBudget || 'Not specified'}</td>
              </tr>
            </table>
          </div>
          
          ${calculatedEstimate ? `
          <div style="background: #e8f5e9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4caf50;">
            <h3 style="color: #2e7d32; margin-top: 0;">Calculated Estimate</h3>
            <p style="font-size: 24px; font-weight: bold; color: #2e7d32; margin: 10px 0;">
              ${formatCurrency(calculatedEstimate.totalEstimate || 0)}
            </p>
            <p style="color: #555; margin: 5px 0;">
              Base Cost: ${formatCurrency(calculatedEstimate.baseCost || 0)}
            </p>
          </div>
          ` : ''}
          
          <div style="text-align: center; margin-top: 30px; padding: 20px; background: #f5f5f5; border-radius: 8px;">
            <p style="color: #777; margin: 0;">Received on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
            <p style="color: #a68a6b; font-weight: bold; margin: 10px 0 0 0;">Shravan Puri architects studio</p>
          </div>
        </div>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Estimate notification email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Failed to send estimate notification:', error.message);
    return { success: false, error: error.message };
  }
};

// Send OTP Email
const sendOTP = async (toEmail, otp, purpose = 'verification') => {
  try {
    const mailOptions = {
      from: '"Shravan Puri architects studio" <sparchitects93@gmail.com>',
      to: toEmail,
      subject: `Your OTP Code - ${purpose === 'estimate' ? 'Estimate Request' : 'Verification'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; text-align: center;">
          <div style="background: #a68a6b; padding: 30px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Shravan Puri architects studio</h1>
          </div>
          
          <div style="background: #f9f9f9; padding: 40px 30px; border-radius: 0 0 8px 8px;">
            <h2 style="color: #333; margin-top: 0;">Your Verification Code</h2>
            <p style="color: #666; font-size: 16px; margin: 20px 0;">
              Please use the following OTP to verify your ${purpose === 'estimate' ? 'estimate request' : 'submission'}:
            </p>
            
            <div style="background: white; padding: 30px; border-radius: 8px; margin: 30px 0; border: 2px dashed #a68a6b;">
              <span style="font-size: 42px; font-weight: bold; color: #a68a6b; letter-spacing: 10px;">${otp}</span>
            </div>
            
            <p style="color: #999; font-size: 14px; margin: 20px 0;">
              This code will expire in 10 minutes.<br>
              Do not share this code with anyone.
            </p>
            
            <p style="color: #777; font-size: 12px; margin-top: 30px;">
              If you didn't request this code, please ignore this email.
            </p>
          </div>
        </div>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ OTP email sent to:', toEmail, 'Message ID:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Failed to send OTP:', error.message);
    return { success: false, error: error.message };
  }
};

// Send Thank You Email to Customer
const sendThankYouEmail = async (toEmail, name, type = 'contact') => {
  try {
    const isEstimate = type === 'estimate';
    
    const mailOptions = {
      from: '"Shravan Puri architects studio" <sparchitects93@gmail.com>',
      to: toEmail,
      subject: isEstimate ? 'Thank You for Your Estimate Request' : 'Thank You for Contacting Us',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #a68a6b; padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 32px;">Thank You, ${name}!</h1>
          </div>
          
          <div style="background: #f9f9f9; padding: 40px 30px; border-radius: 0 0 8px 8px;">
            <p style="color: #555; font-size: 16px; line-height: 1.8;">
              We have received your ${isEstimate ? 'estimate request' : 'message'} and our team will review it shortly.
            </p>
            
            <div style="background: white; padding: 25px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #a68a6b;">
              <h3 style="color: #a68a6b; margin-top: 0;">What happens next?</h3>
              <ul style="color: #555; line-height: 1.8; text-align: left;">
                <li>Our experts will review your ${isEstimate ? 'requirements' : 'message'}</li>
                <li>We will contact you within 24-48 hours</li>
                <li>${isEstimate ? 'We will provide a detailed cost estimate' : 'We will discuss your project in detail'}</li>
                <li>Schedule a free consultation if needed</li>
              </ul>
            </div>
            
            <p style="color: #555; font-size: 16px; line-height: 1.8;">
              For urgent queries, you can reach us directly at:<br>
              <strong style="color: #a68a6b;">Phone: +91 98765 43210</strong><br>
              <strong style="color: #a68a6b;">Email: info@architecturestudio.com</strong>
            </p>
            
            <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #ddd;">
              <p style="color: #999; font-size: 14px;">Best regards,</p>
              <p style="color: #a68a6b; font-weight: bold; font-size: 18px; margin: 10px 0;">Architecture Studio Team</p>
            </div>
          </div>
        </div>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Thank you email sent to:', toEmail);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Failed to send thank you email:', error.message);
    return { success: false, error: error.message };
  }
};

// Send Email from Admin to Customer
const sendAdminEmail = async (toEmail, subject, message, customerName) => {
  try {
    const mailOptions = {
      from: '"Shravan Puri architects studio" <sparchitects93@gmail.com>',
      to: toEmail,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #a68a6b; padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 32px;">Shravan Puri architects studio</h1>
          </div>
          
          <div style="background: #f9f9f9; padding: 40px 30px; border-radius: 0 0 8px 8px;">
            <h2 style="color: #333; margin-top: 0;">Hello ${customerName},</h2>
            
            <div style="background: white; padding: 25px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #a68a6b;">
              <p style="color: #555; font-size: 16px; line-height: 1.8; white-space: pre-wrap; word-wrap: break-word;">
                ${message}
              </p>
            </div>
            
            <p style="color: #555; font-size: 14px; line-height: 1.8;">
              For any questions, please feel free to reach out to us.
            </p>
            
            <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #ddd;">
              <p style="color: #999; font-size: 14px;">Best regards,</p>
              <p style="color: #a68a6b; font-weight: bold; font-size: 18px; margin: 10px 0 0 0;">Shravan Puri architects studio Team</p>
            </div>
          </div>
        </div>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Admin email sent to:', toEmail);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Failed to send admin email:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  verifySMTP,
  sendContactNotification,
  sendEstimateNotification,
  sendOTP,
  sendThankYouEmail,
  sendAdminEmail
};
