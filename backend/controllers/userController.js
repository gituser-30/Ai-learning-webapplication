const User = require("../models/User");

exports.getProfile = async (req, res) => {
  const user = await User.findById(req.userId).select("-password");
  res.json(user);
};

exports.updateProfile = async (req, res) => {
  const { name } = req.body;

  const user = await User.findByIdAndUpdate(
    req.userId,
    { name },
    { new: true }
  ).select("-password");

  res.json(user);
};
