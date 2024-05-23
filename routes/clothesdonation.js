const auth = require("../middleware/auth");
const ClothesDonation = require("../models/ClothesDonation");

const router = require("express").Router();
const nodemailer = require("nodemailer");

router.get("/", (req, res) => {
  res.send("Clothes Donation route is working");
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

// Generate a unique ID for the appointment
const generateUniqueId = () => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");

  return `SM${year}${month}${day}${hours}${minutes}${seconds}`;
};
// Route handler to handle POST requests to create a new ClothesDonation instance
router.post("/create", auth, async (req, res) => {
  try {
    // Extract data from the request body
    const { date, state, district, address, contactNumber } = req.body;
    const userId = req.user._id; // Assuming the user ID is stored in _id field
    const userEmail = req.user.email;
    // Validate the required fields
    if (!date || !state || !district || !address || !contactNumber) {
      return res.status(400).json({ error: "All fields are required" });
    }
    // userId;
    // Generate a unique ID
    const uniqueId = generateUniqueId();
    console.log("create", uniqueId);

    // Create a new ClothesDonation instance
    const newClothesData = new ClothesDonation({
      date,
      state,
      district,
      address,
      uniqueId,
      contactNumber,
      userId,
    });

    // Save the new instance to the database
    const savedClothesData = await newClothesData.save();

    // Check if emailForwarded exists and is truthy
    const customMessage = `
    <p>Thank for sharing YOur Things..</p>
    <p>Your Unique ID: ${uniqueId}</p>
    <p>Thank you.</p>
    <img src="https://i.ibb.co/qYGCxnf/logo5.png" alt="logo" width="150px"/>`;
    if (userEmail) {
      // Send email if emailForwarded is truthy
      await sendEmail(
        userEmail,
        "Urgent: Potential Blood Donors Available on Share More Platform",
        `${customMessage}`
      );
      console.log("Email is sent to:", userEmail);
    }
    // console.log(savedClothesData, "saveClothesData");
    console.log(userEmail, "userEmail");
    // Return a success response with the saved instance
    res.status(201).json(savedClothesData);
  } catch (error) {
    // Return an error response if something goes wrong
    res.status(500).json({ error: error.message });
  }
});

router.get("/all_info", async (req, res) => {
  try {
    // Populate the 'userPastingId' field with the corresponding  document
    const datas = await ClothesDonation.find().populate("userId");

    res.status(200).json(datas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});
router.get("/user-clothes_info", auth, async (req, res) => {
  const userId = req.user.id; // Retrieved from authenticated user
  try {
    const response_data = await ClothesDonation.find({ userId }).populate(
      "userId"
    );
    res.json(response_data);
    console.log(response_data);
  } catch (error) {
    res.status(500).send({ error: "Error fetching Clothes info" });
  }
});
module.exports = router;
