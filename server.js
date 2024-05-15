const express = require("express");
const app = express();
// Access the env variable
const dotenv = require("dotenv").config();
const connectDB = require("./config/dbConnect");
const cors = require("cors");
const apiRouter = require("./routes");
// const twilio = require("twilio");
// const nodemailer = require("nodemailer");
connectDB();

app.use(cors());
app.use(express.json());

// test code

// const client = twilio(accountSid, authToken);
// app.post("/send-otp", async (req, res) => {
//   const { mobileNumber } = req.body;
//   const otp = Math.floor(100000 + Math.random() * 900000); // Generate a random 6-digit OTP
//   console.log(otp);
//   try {
//     await client.messages.create({
//       body: `Your OTP is: ${otp}`,
//       from: twilioPhoneNumber,
//       to: mobileNumber,
//     });

//     res.json({ message: "OTP sent successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to send OTP" });
//   }
// });
//

// email testing
// Create a transporter object using SMTP transport
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_NAME,
//     pass: process.env.EMAIL_PASS,
//   },
// });
// app.post("/send-otp", async (req, res) => {
//   const { email } = req.body;
//   const otp = Math.floor(100000 + Math.random() * 900000); // Generate a random 6-digit OTP
//   console.log(otp);
//   // Define email options
//   const mailOptions = {
//     from: "sangeetha0apple@gmail.com",
//     to: email,
//     subject: "Your OTP",
//     text: `Your OTP is: ${otp}`,
//   };

//   try {
//     // Send the email
//     await transporter.sendMail(mailOptions);
//     res.json({ message: "OTP sent successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to send OTP,,,,," });
//   }
// });

// ==============================
app.use("/api", apiRouter);

app.get("/", (req, res) => res.send("API is running  🌎 !!!"));

const PORT = 4000;
app.listen(PORT, () => console.log("APP is Connected on PORT", PORT));
