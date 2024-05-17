const router = require("express").Router();
const Donor = require("../models/donor");

router.post("/search", async (req, res) => {
  const { bloodType, state, district } = req.body;

  try {
    // Search for donors matching the provided blood type, state, and district
    const matchedDonors = await Donor.find({
      bloodType,
      state,
      district,
    });

    res.json(matchedDonors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
