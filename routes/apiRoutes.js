const express = require("express");
const multer = require("multer");
const apiController = require("../controllers/apiController");
const router = express.Router();

const upload = multer({ dest: "uploads/" });

// Routes
router.post("/upload", upload.single("file"), apiController.uploadData);
router.get("/analyze", apiController.analyzeData);
router.get("/recommend", apiController.getRecommendations);
router.post("/chat", apiController.chatBot);

module.exports = router;
