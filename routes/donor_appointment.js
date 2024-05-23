const router = require("express").Router();
const auth = require("../middleware/auth");
const DonorAppointment = require("../models/donor_appointment");
const Donor = require("../models/donor"); // Import the Donor model
const User = require("../models/User"); // Import the Donor model

const cron = require("node-cron");
const nodemailer = require("nodemailer");
const twilio = require("twilio"); //1. import

// Set up email transporter using Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail", // You can use any email service
  auth: {
    user: process.env.EMAIL_NAME,
    pass: process.env.EMAIL_PASS,
  },
});

// Set up Twilio client
const twilioClient = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);

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

// Function to send SMS
const sendSms = async (to, message) => {
  console.log(to, "tooo");
  await twilioClient.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: "+" + to, // Concatenate "+" with the to variable
  });
};

// Schedule the cron job to run at 8:00 AM every day
cron.schedule("0 8 * * *", async () => {
  try {
    const now = new Date();
    const appointments = await DonorAppointment.find({
      reminder_date: { $lte: now },
      reminder_sent: false,
    }).populate("donor_id");
    console.log(appointments, "appointments");
    for (const appointment of appointments) {
      if (!appointment.donor_id) continue;

      const { donor_id: donor, reminder_method } = appointment;
      const message = `Reminder: You have an appointment on ${appointment.appointment_date}`;

      if (reminder_method === "email") {
        await sendEmail(donor.email, "Appointment Reminder", message);
        console.log("email is sent.....");
      } else if (reminder_method === "sms") {
        await sendSms(donor.contactNumber, message);
        console.log("donor.contactNumber", donor.contactNumber);
        console.log("SMS is sent.....");
      }

      // Update appointment to indicate reminder has been sent
      appointment.reminder_sent = true;
      await appointment.save();
    }
  } catch (error) {
    console.error("Error sending reminders:", error);
  }
});

// Generate a unique ID for the appointment
const generateUniqueId = () => {
  const now = new Date();

  // const year = now.getFullYear().toString().slice(-2);
  // const month = (now.getMonth() + 1).toString().padStart(2, "0");
  // const day = now.getDate().toString().padStart(2, "0");
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");

  return `SM${hours}${minutes}${seconds}`;
};

// Create an appointment
router.post("/booking", auth, async (req, res) => {
  const {
    appointment_date,
    reminder_date,
    reminder_method,
    state,
    district,
    hosptial_blood_bank_id,
  } = req.body;
  const donor_id = req.user._id; // Retrieved from authenticated user

  // Validate input data
  if (!appointment_date || !state || !district) {
    return res.status(400).json({ msg: "Please provide all required fields." });
  }

  const unique_id = generateUniqueId();

  try {
    const newAppointment = new DonorAppointment({
      state,
      district,
      donor_id,
      appointment_date,
      unique_id,
      reminder_date,
      reminder_method,
      hosptial_blood_bank_id,
    });

    await newAppointment.save();
    res.status(201).json(newAppointment);
  } catch (err) {
    console.error("Error creating appointment:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
});
// Get all appointments for the logged-in donor
router.get("/get_booking_info", auth, async (req, res) => {
  try {
    const appointments = await DonorAppointment.find({
      donor_id: req.user._id,
    });
    res.json(appointments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
// get all appoinment list
// router.get("/all_appoinment_list", async (req, res) => {
//   try {
//     const donors = await DonorAppointment.find();
//     res.status(200).json(donors);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server error" });
//   }
// });
// router.get("/all_appoinment_list", async (req, res) => {
//   try {
//     const appointments = await DonorAppointment.find();
//     res.status(200).json(appointments);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server error" });
//   }
// });

router.get("/all_appoinment_list", async (req, res) => {
  try {
    // Populate the 'donor_id' field with the corresponding Donor document
    const appointments = await DonorAppointment.find().populate("donor_id");

    res.status(200).json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});
router.get("/user-donor_info", auth, async (req, res) => {
  const donor_id = req.user._id; // Retrieved from authenticated user
  try {
    const response_data = await DonorAppointment.find({
      donor_id,
    })
      .populate("donor_id")
      .populate("hosptial_blood_bank_id");
    res.json(response_data);
    console.log(response_data);
  } catch (error) {
    res.status(500).send({ error: "Error fetching Donor info" });
  }
});

module.exports = router;
