const FoodDay = require("../models/FoodDay");
const Organization = require("../models/Organization");

const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("Food route is working");
});
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
// Route handler to handle POST requests to create a new FoodDay instance
router.post("/create", async (req, res) => {
  try {
    // Extract data from the request body
    const {
      date,
      state,
      district,
      maxMember,
      charityId,
      contactNumber,
      action,
    } = req.body;
    const uniqueId = generateUniqueId();
    console.log("create", uniqueId);
    // Create a new FoodDay instance
    const newFoodDay = new FoodDay({
      date,
      state,
      district,
      maxMember,
      uniqueId,
      charityId,
      contactNumber,
      action,
    });

    // Save the new instance to the database
    const savedFoodDay = await newFoodDay.save();
    console.log(savedFoodDay, "saveFoodDay");
    // Return a success response with the saved instance
    res.status(201).json(savedFoodDay);
  } catch (error) {
    // Return an error response if something goes wrong
    res.status(500).json({ error: error.message });
  }
});

router.post("/charity", async (req, res) => {
  const { state, district } = req.body;

  try {
    // Search for organizations matching the provided state, district, and type
    const matchedOrganizations = await Organization.find({
      state,
      district,
      type: { $in: ["charity"] }, // Filter by organization type
    });

    res.json(matchedOrganizations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
