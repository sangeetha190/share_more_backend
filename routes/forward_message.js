const ForwardedBloodDonationMessage = require("../models/forwardmessgae");
const auth = require("../middleware/auth");
const router = require("express").Router();
const nodemailer = require("nodemailer");
const Donor = require("../models/donor");

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

    // Calculate the date two months ago using JavaScript's Date object
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

    // Filter donors based on bloodGroupForwarded and last_donation_date, limit to 10 donors
    const donors = await Donor.find({
      bloodGroup: bloodGroupForwarded,
      last_donation_date: { $lte: twoMonthsAgo }, // Only include donors who donated more than two months ago
    }).limit(10);

    // Extract contact numbers
    const donorContactNumbers = donors
      .map((donor) => donor.contactNumber)
      .join(", ");
    const donorEmailAddresses = donors.map((donor) => donor.email).join(", ");

    // Notify each donor and collect email addresses
    const emailPromises = donors.map((donor) => {
      const donorNotificationMessage = `
    <p>Dear ${donor.name},</p>
    <p>We hope this message finds you well. We are reaching out to inform you that your contact information has been shared with a potential blood recipient. Your willingness to donate blood can help save lives, and we greatly appreciate your generosity.</p>
    <p><strong>Potential Recipient's Contact Number:</strong> ${contactNumberForwarded}</p>
    <p>Please be available for donation if you are contacted by the recipient. Your timely response and willingness to donate can make a significant difference.</p>
    <p>Thank you for being a part of our community and for your continued support.</p>
    <p>Best regards,</p>
    <p>- Share More Team</p>
    <img src="https://i.ibb.co/qYGCxnf/logo5.png" alt="Share More Logo" width="150px"/>
  `;
      return sendEmail(
        donor.email,
        "Your Contact Information Has Been Shared for Blood Donation",
        donorNotificationMessage
      );
    });

    // Wait for all donor emails to be sent
    await Promise.all(emailPromises);
    // Check if emailForwarded exists and is truthy
    const customMessage = `<p>We have potential donors matching your requirements on our site. Please visit our site to find the donor you are looking for. Your visit can help save a life. </p>
    <p>Contact Numbers of Potential Donors You are looking for: ${donorContactNumbers}</p>
    <p>Email Addresses of Potential Donors You are looking for: ${donorEmailAddresses}</p>
    <a href="https://sharemore.netlify.app/">Visit Our Site</a>
    <p>Thank you.</p>
    <p>- Share More Team</p>
    <img src="https://i.ibb.co/qYGCxnf/logo5.png" alt="logo" width="150px"/>
    `;

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
// POST route to create a forwarded blood donation message
router.post("/create_forward_msg_details", auth, async (req, res) => {
  try {
    const { bloodGroupForwarded, contactNumberForwarded, emailForwarded } =
      req.body;
    const userPastingId = req.user._id; // Assuming the user ID is stored in _id field

    // Create the forwarded blood donation message
    const createdMessage = new ForwardedBloodDonationMessage({
      forwardedMessage: "null",
      bloodGroupForwarded,
      contactNumberForwarded,
      emailForwarded,
      userPastingId,
    });

    await createdMessage.save();

    // Calculate the date two months ago using JavaScript's Date object
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

    // Filter donors based on bloodGroupForwarded and last_donation_date, limit to 10 donors
    const donors = await Donor.find({
      bloodGroup: bloodGroupForwarded,
      last_donation_date: { $lte: twoMonthsAgo }, // Only include donors who donated more than two months ago
    }).limit(10);

    // Extract contact numbers
    const donorContactNumbers = donors
      .map((donor) => donor.contactNumber)
      .join(", ");
    const donorEmailAddresses = donors.map((donor) => donor.email).join(", ");

    // Notify each donor and collect email addresses
    const emailPromises = donors.map((donor) => {
      const donorNotificationMessage = `
    <p>Dear ${donor.name},</p>
    <p>We hope this message finds you well. We are reaching out to inform you that your contact information has been shared with a potential blood recipient. Your willingness to donate blood can help save lives, and we greatly appreciate your generosity.</p>
    <p><strong>Potential Recipient's Contact Number:</strong> ${contactNumberForwarded}</p>
    <p>Please be available for donation if you are contacted by the recipient. Your timely response and willingness to donate can make a significant difference.</p>
    <p>Thank you for being a part of our community and for your continued support.</p>
    <p>Best regards,</p>
    <p>- Share More Team</p>
    <img src="https://i.ibb.co/qYGCxnf/logo5.png" alt="Share More Logo" width="150px"/>
  `;
      return sendEmail(
        donor.email,
        "Your Contact Information Has Been Shared for Blood Donation",
        donorNotificationMessage
      );
    });

    // Wait for all donor emails to be sent
    await Promise.all(emailPromises);
    // Check if emailForwarded exists and is truthy
    const customMessage = `<p>We have potential donors matching your requirements on our site. Please visit our site to find the donor you are looking for. Your visit can help save a life. </p>
    <p>Contact Numbers of Potential Donors You are looking for: ${donorContactNumbers}</p>
    <p>Email Addresses of Potential Donors You are looking for: ${donorEmailAddresses}</p>
    <a href="https://sharemore.netlify.app/">Visit Our Site</a>
    <p>Thank you.</p>
    <p>- Share More Team</p>
    <img src="https://i.ibb.co/qYGCxnf/logo5.png" alt="logo" width="150px"/>
    `;

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
