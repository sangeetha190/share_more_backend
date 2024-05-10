const router = require("express").Router();
const userRouter = require("./user");
const adminRouter = require("./admin");
const supportTeamRouter = require("./support_team");

router.use("/user", userRouter);
router.use("/admin", adminRouter);
router.use("/support_team", supportTeamRouter);

module.exports = router;
