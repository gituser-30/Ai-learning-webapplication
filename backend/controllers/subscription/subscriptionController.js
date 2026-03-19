const Subscription = require("../../models/Subscription");

// =====================
// UPGRADE PLAN (TEMP)
// =====================
exports.upgrade = async (req, res) => {
  try {
    let sub = await Subscription.findOne({ user: req.userId });

    if (!sub)
      sub = await Subscription.create({ user: req.userId });

    sub.plan = "pro";
    sub.validUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await sub.save();

    res.json({ success: true });

  } catch (err) {
    console.error("UPGRADE ERROR:", err.message);
    res.status(500).json({ message: "Upgrade failed" });
  }
};
