const Subscription = require("../models/Subscription");
const { FREE_TOPIC_LIMIT } = require("../config/limits");
const Topic = require("../models/learning/Topic");

module.exports = async function courseAccess(req, res, next) {

  const userId = req.userId;
  const topicId = req.params.topicId;

  const topic = await Topic.findById(topicId);
  const sub = await Subscription.findOne({ user: userId });

  // free plan restriction
  if (!sub || sub.plan === "free") {
    if (topic.order > FREE_TOPIC_LIMIT) {
      return res.status(402).json({
        message: "Upgrade required to continue learning",
        locked: true
      });
    }
  }

  next();
};
