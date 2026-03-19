// const express = require("express");
// const router = express.Router();
// const { aiTutorChat } = require("../controllers/tutorController");
// const protect = require("../middleware/authMiddleware");

// router.post("/chat", protect, aiTutorChat);

// module.exports = router;
const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  aiTutorChat,
  getMyChats,
  getChatMessages
} = require("../controllers/tutorController");

router.post("/chat", protect, aiTutorChat);
router.get("/my-chats", protect, getMyChats);
router.get("/chat/:chatId", protect, getChatMessages);

module.exports = router;

