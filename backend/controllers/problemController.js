const Problem = require("../models/Problem");

exports.getAllProblems = async (req, res) => {
  const problems = await Problem.find().select(
    "title difficulty topic"
  );
  res.json(problems);
};

exports.getProblemById = async (req, res) => {
  const problem = await Problem.findById(req.params.id);
  res.json(problem);
};


// GET problems by domain
exports.getProblemsByDomain = async (req, res) => {
  try {
    const problems = await Problem.find({ domain: req.params.domainId })
      .select("title difficulty");

    res.json(problems);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};