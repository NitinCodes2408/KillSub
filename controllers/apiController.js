const fs = require("fs");
const csv = require("csv-parser");
const { detectSubscriptions } = require("../services/detection");
const { classifyCategory } = require("../services/categorization");
const { generateAnalytics } = require("../services/analytics");
const { getPredictions } = require("../services/prediction");
const { generateRecommendations } = require("../services/recommendation");
const { generateSmartSwitches } = require("../services/smartSwitch");

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
  const recommendations = generateRecommendations(subs);
  const smartSwitches = generateSmartSwitches(subs);

  res.json({
    transactions: globalTransactions,
    subscriptions: subs,
    analytics,
    predictions,
    recommendations,
    smartSwitches
  });
};

exports.getTransactions = (req, res) => {
  res.json(globalTransactions);
};

exports.getSubscriptions = (req, res) => {
  const subs = globalTransactions.filter(t => t.isSubscription);
  res.json(subs);
};

exports.getAnalytics = (req, res) => {
  const subs = globalTransactions.filter(t => t.isSubscription);
  const analytics = generateAnalytics(subs);
  // Enhance with smartSwitches for the dashboard
  const smartSwitches = generateSmartSwitches(subs);
  res.json({ ...analytics, smartSwitches });
};

exports.getPredictionsAPI = (req, res) => {
  const subs = globalTransactions.filter(t => t.isSubscription);
  const analytics = generateAnalytics(subs);
  res.json(getPredictions(analytics.totalMonthly));
};

exports.getRecommendations = (req, res) => {
  let subs = detectSubscriptions(globalTransactions).map(sub => ({
    ...sub,
    category: classifyCategory(sub.name)
  }));
  
  const recs = generateRecommendations(subs);
  res.json(recs);
};

exports.chatBot = (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message required" });

  const subs = globalTransactions.filter(t => t.isSubscription);
  const recs = generateRecommendations(subs);

  const lowerMsg = message.toLowerCase();
  let reply = "I am Subkill AI. I can analyze your subscriptions, tell you where to save money, and explain how this platform works! Feel free to ask.";

  // App FAQ Heuristics
  if (lowerMsg.includes("what is") && (lowerMsg.includes("app") || lowerMsg.includes("subkill"))) {
    reply = "Subkill is a premium Fintech Dashboard designed to analyze your bank transactions, detect hidden recurring subscriptions, and automatically recommend cuts to save you money!";
  } else if (lowerMsg.includes("how") && (lowerMsg.includes("use") || lowerMsg.includes("upload") || lowerMsg.includes("work"))) {
    reply = "It's simple! You go to the Upload screen and drag-and-drop a CSV or JSON file containing your bank transactions. Our AI engine scans the data, finds recurring intervals, and generates this dashboard.";
  } else if (lowerMsg.includes("who made") || lowerMsg.includes("creator") || lowerMsg.includes("developer")) {
    reply = "Subkill was built as a hackathon-winning project, showcasing advanced MVC architecture, real-time Recharts analytics, and a stunning dark futuristic UI!";
  } else if (lowerMsg.includes("predictor") || lowerMsg.includes("future") || lowerMsg.includes("loss")) {
    reply = "The Future Loss Predictor is an advanced analytics algorithm that projects how much your current subscriptions will cost you over the next 1 Year and 5 Years if left uncancelled. It helps visualize long-term financial drain.";
  } else if (lowerMsg.includes("hello") || lowerMsg.includes("hi ") || lowerMsg === "hi" || lowerMsg.includes("hey")) {
    reply = "Hello! I am Subkill AI. Ready to slash some subscriptions? Ask me about your highest expense, or how Subkill works.";
  }
  // Subscription Analytics Heuristics
  else if (lowerMsg.includes("most") || lowerMsg.includes("highest") || lowerMsg.includes("expensive")) {
    if (subs.length === 0) return res.json({ reply: "You don't have any subscriptions yet!" });
    const highest = [...subs].sort((a,b) => b.amount - a.amount)[0];
    reply = `Your most expensive subscription is **${highest.merchant}** at $${highest.amount.toFixed(2)} per cycle.`;
  } else if (lowerMsg.includes("save") || lowerMsg.includes("cancel") || lowerMsg.includes("recommend")) {
    if (recs.length === 0) return res.json({ reply: "I don't have any cancellation recommendations for you right now. You're doing great!" });
    const rec = recs[0];
    reply = `I highly recommend looking at **${rec.merchant}**. Reason: ${rec.reason}. Cancelling it saves you $${rec.savedCost.toFixed(2)}/mo.`;
  } else if (lowerMsg.includes("total") || lowerMsg.includes("month") || lowerMsg.includes("spending")) {
    const total = subs.reduce((sum, s) => sum + s.amount, 0);
    reply = `You are currently spending **$${total.toFixed(2)}** per month on subscriptions.`;
  }

  // Simulate network delay for natural bot feel
  setTimeout(() => {
    res.json({ reply });
  }, 1000);
};
