const router = require("express").Router();
const nodemailer = require("nodemailer");

// Set up email transporter using Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_NAME,
    pass: process.env.EMAIL_PASS,
  },
  pool: true,
  maxConnections: 5,
  maxMessages: 10,
  rateLimit: 5,
});
// Function to send email
const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_NAME,
    to: to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
};

// Route to send a test email
router.post("/send_email", async (req, res) => {
  const { to, subject, text } = req.body;

  try {
    const info = await sendEmail(to, subject, text);
    console.log("Email sent: " + info);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email: ", error);
    res
      .status(500)
      .json({ message: "Failed to send email", error: error.message });
  }
});
module.exports = router;
