const router = require("express").Router();
const userRouter = require("./user");
const adminRouter = require("./admin");
const supportTeamRouter = require("./support_team");
const donorRouter = require("./donor");
const bloodRouter = require("./blood");
const bloodDonorAppointment = require("./donor_appointment");
const CampSchedule = require("./CampSchedule");
const Organization = require("./Organizations");
const EmailSending = require("./emailandsms");
const FoodDay = require("./food_day");
const ClothesDonation = require("./clothesdonation");
const ForwardedBloodMessge = require("./forward_message");

router.use("/user", userRouter);
router.use("/admin", adminRouter);
router.use("/support_team", supportTeamRouter);
router.use("/donor", donorRouter);
router.use("/blood", bloodRouter);
router.use("/blood_donor_appointment", bloodDonorAppointment);
router.use("/camp_schedule", CampSchedule);
router.use("/organization", Organization);
router.use("/email", EmailSending);
router.use("/share_food", FoodDay);
router.use("/clothes_donation", ClothesDonation);
router.use("/forward_blood_message", ForwardedBloodMessge);

module.exports = router;
