const router = require("express").Router();
const userRouter = require("./user");
const adminRouter = require("./admin");
const supportTeamRouter = require("./support_team");
const donorRouter = require("./donor");
const bloodRouter = require("./blood");

router.use("/user", userRouter);
router.use("/admin", adminRouter);
router.use("/support_team", supportTeamRouter);
router.use("/donor", donorRouter);
router.use("/blood", bloodRouter);

module.exports = router;
