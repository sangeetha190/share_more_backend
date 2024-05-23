const express = require("express");
const app = express();
// Access the env variable
const dotenv = require("dotenv").config();
const connectDB = require("./config/dbConnect");
const cors = require("cors");
const apiRouter = require("./routes");
// const nodemailer = require("nodemailer");
const twilio = require("twilio");
connectDB();

app.use(cors());
app.use(express.json());

// ================================
app.use("/api", apiRouter);
app.get("/", (req, res) => res.send("API is running  🌎 !!!"));

// test code
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
// const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const client = twilio(accountSid, authToken);

app.post("/send-otp", async (req, res) => {
  const { mobileNumber } = req.body;
  console.log(mobileNumber, "mobileNumber");
  const otp = Math.floor(100000 + Math.random() * 900000); // Generate a random 6-digit OTP
  console.log(otp);
  try {
    await client.messages.create({
      body: `Your OTP is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: mobileNumber,
    });

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

// const PORT = process.env.PORT || 4000; // Use the PORT environment variable if available, otherwise default to 4000
const PORT = 4000; // Use the PORT environment variable if available, otherwise default to 4000
app.listen(PORT, () => console.log("APP is Connected on PORT", PORT));
