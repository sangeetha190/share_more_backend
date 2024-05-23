const router = require("express").Router();
const Razorpay = require("razorpay");
const Payment = require("../models/payment");
const auth = require("../middleware/auth");

const razorpay = new Razorpay({
  key_id: process.env.R_KEY_ID,
  key_secret: process.env.R_KEY_SECRT,
});

router.get("/", (req, res) => {
  res.json({ msg: "RAZORPAY Donor route" });
});

router.post("/create-order", async (req, res) => {
  const options = {
    amount: req.body.amount * 100, // amount in the smallest currency unit
    currency: "INR",
    receipt: "order_rcptid_11",
  };
  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
    // console.log(order, "Done");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/verify-payment", auth, async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;
  const userId = req.user.id; // Retrieved from authenticated user

  // Store payment details in the database
  const newPayment = new Payment({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    amount: req.body.amount,
    userId,
  });

  try {
    await newPayment.save();
    res.json({ message: "Payment verified and stored successfully" });
  } catch (error) {
    res.status(500).send(error);
  }
});
// get the data form another table
router.get("/payment_history", async (req, res) => {
  try {
    // Populate the 'userPastingId' field with the corresponding  document
    const datas = await Payment.find().populate("userId");
    res.status(200).json(datas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});
router.get("/user-payments", auth, async (req, res) => {
  const userId = req.user.id; // Retrieved from authenticated user

  try {
    // const payments = await Payment.find({ userId: userId });
    const payments = await Payment.find({ userId }).populate("userId");
    res.json(payments);
    console.log(payments);
  } catch (error) {
    res.status(500).send({ error: "Error fetching payments" });
  }
});
module.exports = router;
