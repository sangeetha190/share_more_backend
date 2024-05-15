const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { Donor } = require("../models");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const verifyAdmin = require("../middleware/Adminverify"); // Assuming verifyAdmin middleware is in a separate file

router.get("/", (req, res) => {
  res.json({ msg: "From Donor route" });
});

// signup
router.post("/signup", async (req, res) => {
  try {
    // Check if email already exists
    const existingUser = await Donor.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(req.body.password, salt);

    console.log(passwordHash);
    // create user in DB
    const donor = await Donor.create({
      name: req.body.name,
      email: req.body.email,
      password: passwordHash,
      contactNumber: req.body.contactNumber,
      age: req.body.age,
      gender: req.body.gender,
      state: req.body.state,
      district: req.body.district,
      status: req.body.status,
      bloodType: req.body.bloodType,
    });

    // Create token based on role and secret key
    const tokenPayload = { userId: donor._id, role: donor.role }; // Include role in token payload
    const token = jwt.sign(tokenPayload, process.env.SECRET_KEY);
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// login using "email" and "password"
router.post("/login", async (req, res) => {
  try {
    // Check if email exists
    const user = await Donor.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: "Email not found" });
    }

    // Check if password is correct
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Create token
    const tokenPayload = { userId: user._id, role: user.role };
    jwt.sign(tokenPayload, process.env.SECRET_KEY, (err, token) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ success: false, msg: "Server error" });
      }
      res
        .status(200)
        .json({ success: true, msg: "Login Successful", token: token });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// login using "email" and "otp"

// email testing
// Create a nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_NAME,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate and store OTP in the database
const generateAndStoreOTP = async (email) => {
  const otp = Math.floor(100000 + Math.random() * 900000); // Generate a random 6-digit OTP
  // Store OTP in the database
  await Donor.findOneAndUpdate({ email }, { otp });
  return otp.toString(); // Convert OTP to string (optional, depending on your database schema)
};
// OTP login
router.post("/otp_login", async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Fetch user from the database using email
    const user = await Donor.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email not found" });
    }

    // Check if OTP matches
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // If OTP is valid, clear OTP from the database
    await Donor.findOneAndUpdate({ email }, { otp: null });

    // Create token
    const tokenPayload = { userId: user._id, role: user.role };
    const token = jwt.sign(tokenPayload, process.env.SECRET_KEY);

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Send OTP to the user's email
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    // Generate OTP and send it via email
    const otp = await generateAndStoreOTP(email);
    const mailOptions = {
      from: "sangeetha0apple@gmail.com", // Enter your Gmail email address
      to: email,
      subject: "Login OTP",
      text: `Your OTP for login is: ${otp}`,
    };
    await transporter.sendMail(mailOptions);

    res.json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ======== edit the Donor
// API endpoint to edit donor model data
router.put("/edit/:id", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      password,
      contactNumber,
      age,
      gender,
      state,
      district,
      status,
      bloodType,
    } = req.body;

    // Hash password if provided
    let hashedPassword;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    // Update donor data
    const updatedDonor = await Donor.findByIdAndUpdate(
      id,
      {
        $set: {
          name,
          email,
          password: hashedPassword, // Update password if provided
          contactNumber,
          age,
          gender,
          state,
          district,
          status,
          bloodType,
        },
      },
      { new: true }
    ); // Return the updated document

    res.json({
      message: "Donor data updated successfully",
      donor: updatedDonor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
//
//Route to delete a donor
router.delete("/delete/:id", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the donor by ID
    const deletedDonor = await Donor.findByIdAndDelete(id);

    // Check if donor exists
    if (!deletedDonor) {
      return res.status(404).json({ message: "Donor not found" });
    }

    res.json({ message: "Donor deleted successfully", donor: deletedDonor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// ==================================================================
// list all the Donors
// Route to list all donors (accessible only to admin)
router.get("/list", verifyAdmin, async (req, res) => {
  try {
    // Find all donors in the database
    const donors = await Donor.find();

    // If there are no donors, return an empty array
    if (!donors || donors.length === 0) {
      return res.status(404).json({ message: "No donors found" });
    }

    // Return the list of donors
    res.json({ donors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = router;
