const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send Job Consulting Payment Confirmation Email
 * @param {string} to         - Candidate's email address
 * @param {string} name       - Candidate's full name
 * @param {string} inquiryId  - MongoDB inquiry _id (short)
 * @param {number} amount     - Amount paid in INR
 * @param {string} type       - Consulting type label
 */
const sendPaymentConfirmationEmail = async (to, name, inquiryId, amount, type) => {
  const shortId = inquiryId.toString().slice(-8).toUpperCase();
  const mailOptions = {
    from: `"FIC - Job Consulting" <${process.env.SMTP_USER}>`,
    to,
    subject: `✅ Payment Confirmed — FIC Job Consulting (Ref: FIC-JC-${shortId})`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Payment Confirmation</title>
</head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a56db 0%,#0e3fa3 100%);padding:40px 40px 32px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:800;letter-spacing:-0.5px;">FORGE INDIA CONNECT</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.75);font-size:13px;letter-spacing:2px;text-transform:uppercase;">Job Consulting Services</p>
            </td>
          </tr>

          <!-- Success Badge -->
          <tr>
            <td style="padding:32px 40px 0;text-align:center;">
              <div style="display:inline-block;background:#ecfdf5;border:2px solid #6ee7b7;border-radius:50px;padding:12px 28px;margin-bottom:24px;">
                <span style="color:#059669;font-size:14px;font-weight:700;letter-spacing:1px;">✅ PAYMENT CONFIRMED</span>
              </div>
              <h2 style="margin:0 0 8px;color:#111827;font-size:24px;font-weight:700;">Hello, ${name}!</h2>
              <p style="margin:0;color:#6b7280;font-size:15px;">Your Job Consulting session has been successfully booked.</p>
            </td>
          </tr>

          <!-- Details Card -->
          <tr>
            <td style="padding:28px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden;">
                <tr>
                  <td style="padding:20px 24px;border-bottom:1px solid #e5e7eb;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="color:#6b7280;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Reference ID</td>
                        <td align="right" style="color:#111827;font-size:14px;font-weight:700;font-family:monospace;">FIC-JC-${shortId}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px 24px;border-bottom:1px solid #e5e7eb;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="color:#6b7280;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Consulting Type</td>
                        <td align="right" style="color:#111827;font-size:14px;font-weight:700;">${type}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px 24px;border-bottom:1px solid #e5e7eb;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="color:#6b7280;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Amount Paid</td>
                        <td align="right" style="color:#059669;font-size:18px;font-weight:800;">₹${amount}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="color:#6b7280;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Status</td>
                        <td align="right"><span style="background:#ecfdf5;color:#059669;font-size:12px;font-weight:700;padding:4px 12px;border-radius:20px;letter-spacing:0.5px;">PAID</span></td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- What's Next -->
          <tr>
            <td style="padding:0 40px 28px;">
              <h3 style="margin:0 0 16px;color:#111827;font-size:16px;font-weight:700;">What Happens Next?</h3>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:0 0 12px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background:#1a56db;border-radius:50%;width:28px;height:28px;text-align:center;vertical-align:middle;">
                          <span style="color:#fff;font-size:13px;font-weight:700;">1</span>
                        </td>
                        <td style="padding-left:14px;color:#374151;font-size:14px;">Our expert consultant will review your profile within <strong>24 hours</strong>.</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 0 12px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background:#1a56db;border-radius:50%;width:28px;height:28px;text-align:center;vertical-align:middle;">
                          <span style="color:#fff;font-size:13px;font-weight:700;">2</span>
                        </td>
                        <td style="padding-left:14px;color:#374151;font-size:14px;">You will receive a <strong>personalized session schedule</strong> via email.</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td>
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background:#1a56db;border-radius:50%;width:28px;height:28px;text-align:center;vertical-align:middle;">
                          <span style="color:#fff;font-size:13px;font-weight:700;">3</span>
                        </td>
                        <td style="padding-left:14px;color:#374151;font-size:14px;">For queries, reply to this email or reach us at <strong>forgeindiahr22@gmail.com</strong></td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#1a56db;padding:28px 40px;text-align:center;">
              <p style="margin:0 0 8px;color:rgba(255,255,255,0.9);font-size:14px;font-weight:600;">Forge India Connect</p>
              <p style="margin:0;color:rgba(255,255,255,0.55);font-size:12px;">This is an automated confirmation. Please do not reply directly.</p>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.55);font-size:11px;">© 2026 Forge India Connect. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendPaymentConfirmationEmail };
