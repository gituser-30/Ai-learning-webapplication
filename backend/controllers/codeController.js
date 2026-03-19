
const Problem = require("../models/Problem");
const { exec } = require("child_process");
const fs = require("fs");
const { executeCode } = require("../utils/codeExecutor");


exports.runCode = async (req, res) => {
  try {
    const { language, code, input } = req.body;

    const output = await executeCode(language, code, input);

    res.json({ output });
  } catch (err) {
    res.json({ output: err.toString() });
  }
};



exports.submitCode = async (req, res) => {
  try {
    const { language, code } = req.body;
    const { problemId } = req.params;

    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    for (let testCase of problem.testCases) {
      const result = await executeCode(language, code, testCase.input);

      if (result.trim() !== testCase.output.trim()) {
        return res.json({
          verdict: "Wrong Answer",
          input: testCase.input,
          expected: testCase.output,
          received: result,
        });
      }
    }

    return res.json({ verdict: "Accepted" });

  } catch (err) {
    return res.json({ verdict: "Runtime Error", error: err.toString() });
  }
};
