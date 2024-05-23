const ForwardedBloodDonationMessage = require("../models/forwardmessgae");
const auth = require("../middleware/auth");
const router = require("express").Router();
const nodemailer = require("nodemailer");

router.get("/", (req, res) => {
  res.send("Forward message route is working");
});
// Set up email transporter using Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail", // You can use any email service
  auth: {
    user: process.env.EMAIL_NAME,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send email
const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_NAME,
    to: to,
    subject,
    html: text, // Set the email content as HTML
  };

  await transporter.sendMail(mailOptions);
};

// POST route to create a forwarded blood donation message
router.post("/create", auth, async (req, res) => {
  try {
    const {
      forwardedMessage,
      bloodGroupForwarded,
      contactNumberForwarded,
      emailForwarded,
    } = req.body;
    const userPastingId = req.user._id; // Assuming the user ID is stored in _id field

    // Create the forwarded blood donation message
    const createdMessage = new ForwardedBloodDonationMessage({
      forwardedMessage,
      bloodGroupForwarded,
      contactNumberForwarded,
      emailForwarded,
      userPastingId,
    });

  await createdMessage.save();

    // Custom message to include in the email body
    // const customMessage = `We have potential donors matching your requirements on our site. Please visit our site to find the donor you are looking for. Your visit can help save a life. Thank you.\n\n- Share More Team`;

    // Check if emailForwarded exists and is truthy
    const customMessage = `<p>We have potential donors matching your requirements on our site. Please visit our site to find the donor you are looking for. Your visit can help save a life. </p>
    <a href="https://sharemore.netlify.app/">Visit Our Site</a>
    <p>Thank you.</p>
    <p>- Share More Team</p>
    <img src="https://i.ibb.co/qYGCxnf/logo5.png" alt="logo" width="150px"/>`;
    if (emailForwarded) {
      // Send email if emailForwarded is truthy
      await sendEmail(
        emailForwarded,
        "Urgent: Potential Blood Donors Available on Share More Platform",
        `${customMessage}`
      );
      console.log("Email is sent to:", emailForwarded);
    }

    console.log("Created forwarded blood donation message:", createdMessage);
    res.status(201).json(createdMessage); // Respond with the created message
  } catch (error) {
    console.error("Error creating forwarded blood donation message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all appointments for the logged-in donor
router.get("/get_data", auth, async (req, res) => {
  try {
    const get_datas = await ForwardedBloodDonationMessage.find({
      userPastingId: req.user._id,
    });
    res.json(get_datas);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
router.get("/all_info", async (req, res) => {
  try {
    // Populate the 'userPastingId' field with the corresponding  document
    const datas = await ForwardedBloodDonationMessage.find().populate(
      "userPastingId"
    );

    res.status(200).json(datas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});
module.exports = router;
