const CampSchedule = require("../models/CampSchedule");

const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("CampSchedule route is working");
});
router.post("/create", async (req, res) => {
  try {
    const {
      start_date,
      end_date,
      organizer,
      address,
      state,
      district,
      time,
      approx_donor,
    } = req.body;

    // Create a new CampSchedule instance
    const newCampSchedule = new CampSchedule({
      start_date,
      end_date,
      organizer,
      address,
      state,
      district,
      time,
      approx_donor,
    });

    // Save the new camp schedule to the database
    await newCampSchedule.save();

    res.status(201).json(newCampSchedule);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});
// Route to list all camp_schedule
router.get("/list", async (req, res) => {
  try {
    const camp_schedule = await CampSchedule.find();
    res.json(camp_schedule);
  } catch (error) {
    console.error("Error fetching camp_schedule list", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ======== edit the Donor
// GET camp_schedule by ID
router.get("/:id", async (req, res) => {
  try {
    const camp_schedule = await CampSchedule.findById(req.params.id);
    if (!camp_schedule) {
      return res.status(404).json({ message: "CampDetails not found" });
    }
    res.json(camp_schedule);
  } catch (error) {
    console.error("Error fetching Camp_Schedule data", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update a CampSchedule by id
router.put("/edit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      start_date,
      end_date,
      organizer,
      address,
      state,
      district,
      time,
      approx_donor,
    } = req.body;

    // Update the CampSchedule instance
    const updatedCampSchedule = await CampSchedule.findByIdAndUpdate(
      id,
      {
        start_date,
        end_date,
        organizer,
        address,
        state,
        district,
        time,
        approx_donor,
      },
      { new: true, omitUndefined: true } // Return the updated document and omit undefined fields
    );

    if (!updatedCampSchedule) {
      return res.status(404).json({ error: "CampSchedule not found" });
    }

    res.status(200).json({
      message: "CampSchedule data updated successfully",
      updatedCampSchedule,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Route to delete a donor
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the CampSchedule by ID
    const Camp_Schedule = await CampSchedule.findByIdAndDelete(id);

    // Check if CampSchedule exists
    if (!Camp_Schedule) {
      return res.status(404).json({ message: "Camp_Schedule Not Found" });
    }

    res.json({
      message: "CampSchedule Deleted Successfully",
      donor: Camp_Schedule,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/search_camp", async (req, res) => {
  const { state, district } = req.body;

  try {
    // Search for organizations matching the provided state, district, and type
    const matchedOrganizations = await CampSchedule.find({
      state,
      district,
    });

    res.json(matchedOrganizations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
