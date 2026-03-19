const Domain = require("../models/Domain");

// GET ALL DOMAINS
exports.getDomains = async (req, res) => {
  try {
    const domains = await Domain.find();
    res.json(domains);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
