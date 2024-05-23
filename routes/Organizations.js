const Organization = require("../models/Organization");

const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("Organization route is working");
});

// Create a new organization
router.post("/create", async (req, res) => {
  try {
    const organization = new Organization(req.body);
    await organization.save();
    res.status(201).send(organization);
  } catch (error) {
    res.status(400).send(error);
  }
});
// Get all entities
router.get("/all_data", async (req, res) => {
  try {
    const entities = await Organization.find({});
    res.status(200).send(entities);
  } catch (error) {
    res.status(500).send(error);
  }
});
// Get an entity by ID
router.get("/edit/:id", async (req, res) => {
  try {
    const entity = await Organization.findById(req.params.id);
    if (!entity) {
      return res.status(404).send();
    }
    res.status(200).send(entity);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update an entity by ID
router.put("/update/:id", async (req, res) => {
  try {
    const organization = await Organization.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!organization) {
      return res.status(404).send();
    }
    res.status(200).send(organization);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete an entity by ID
router.delete("/delete/:id", async (req, res) => {
  try {
    const organization = await Organization.findByIdAndDelete(req.params.id);
    if (!organization) {
      return res.status(404).send();
    }
    res.status(200).send({ message: "Organization deleted successfully" });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/hospital_bloodbank", async (req, res) => {
  const { state, district } = req.body;

  try {
    // Search for organizations matching the provided state, district, and type
    const matchedOrganizations = await Organization.find({
      state,
      district,
      type: { $in: ["hospital", "blood bank"] }, // Filter by organization type
    });

    res.json(matchedOrganizations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
