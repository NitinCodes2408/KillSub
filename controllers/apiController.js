const fs = require("fs");
const csv = require("csv-parser");
const { detectSubscriptions } = require("../services/detection");
const { classifyCategory } = require("../services/categorization");
const { generateAnalytics } = require("../services/analytics");
const { getPredictions } = require("../services/prediction");
const { generateRecommendations } = require("../services/recommendation");

// In-memory global store for the hackathon
let globalTransactions = [];
// Load default sample if available
try {
   globalTransactions = JSON.parse(fs.readFileSync("data/sample.json", "utf-8"));
} catch(e) {
   console.log("No default sample.json loaded.");
}

exports.uploadData = (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const results = [];
  const filePath = req.file.path;

  if (req.file.mimetype.includes("csv")) {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => {
        globalTransactions = results;
        fs.unlinkSync(filePath); // clean up
        res.json({ message: "CSV parsed successfully", count: results.length });
      });
  } else if (req.file.mimetype.includes("json")) {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      globalTransactions = Array.isArray(data) ? data : [data];
      fs.unlinkSync(filePath);
      res.json({ message: "JSON parsed successfully", count: globalTransactions.length });
    } catch (e) {
      res.status(400).json({ error: "Invalid JSON format" });
    }
  } else {
    fs.unlinkSync(filePath);
    res.status(400).json({ error: "Unsupported file type" });
  }
};

exports.analyzeData = (req, res) => {
  if (globalTransactions.length === 0) {
    return res.status(400).json({ error: "No transactions available. Please upload data." });
  }

  // 1. Detect Subscriptions
  let subs = detectSubscriptions(globalTransactions);
  
  // 2. Classify Categories
  subs = subs.map(sub => ({
    ...sub,
    category: classifyCategory(sub.name)
  }));

  // 3. Analytics & Prediction
  const analytics = generateAnalytics(subs);
  const predictions = getPredictions(analytics.totalMonthly);

  res.json({
    subs,
    ...analytics,
    predictions
  });
};

exports.getRecommendations = (req, res) => {
  let subs = detectSubscriptions(globalTransactions).map(sub => ({
    ...sub,
    category: classifyCategory(sub.name)
  }));
  
  const recs = generateRecommendations(subs);
  res.json({ recommendations: recs });
};

exports.chatBot = (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ reply: "Say something!" });
  
  let subs = detectSubscriptions(globalTransactions).map(sub => ({
    ...sub,
    category: classifyCategory(sub.name)
  }));

  const analytics = generateAnalytics(subs);
  const recs = generateRecommendations(subs);

  const lowerMsg = message.toLowerCase();
  let reply = "Hello! I am Subkill AI. How can I help you slash subscriptions?";

  if (lowerMsg.includes("most") || lowerMsg.includes("highest")) {
    if (subs.length === 0) return res.json({ reply: "You don't have any subscriptions yet!" });
    const top = subs.sort((a,b) => b.amount - a.amount)[0];
    reply = `You are spending the most on ${top.name} at ₹${top.amount}/${top.frequency}.`;
  } else if (lowerMsg.includes("save") || lowerMsg.includes("how to")) {
    if (recs.length === 0) return res.json({ reply: "You're fully optimized! Great job." });
    reply = `You can save ₹${recs.reduce((acc, r)=>acc+r.saveAmount, 0)}/month! I recommend starting by canceling ${recs[0].title.replace("Cancel ", "")}.`;
  } else if (lowerMsg.includes("total") || lowerMsg.includes("much")) {
    reply = `You're currently losing ₹${analytics.totalMonthly} every month to subscriptions!`;
  }

  res.json({ reply });
};
