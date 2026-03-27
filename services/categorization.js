const keywordMap = {
  "netflix": "Entertainment",
  "prime": "Entertainment",
  "spotify": "Entertainment",
  "disney": "Entertainment",
  "hulu": "Entertainment",
  "youtube": "Entertainment",
  "gym": "Fitness",
  "cult": "Fitness",
  "fitness": "Fitness",
  "adobe": "Software",
  "figma": "Software",
  "github": "Software",
  "electricity": "Utilities",
  "water": "Utilities",
  "jio": "Utilities",
  "airtel": "Utilities",
  "broadband": "Utilities",
};

/**
 * Classify a merchant into a category using keyword mapping
 */
function classifyCategory(merchantName) {
  if (!merchantName) return "Uncategorized";
  const lowerName = merchantName.toLowerCase();
  
  for (const keyword in keywordMap) {
    if (lowerName.includes(keyword)) {
      return keywordMap[keyword];
    }
  }
  return "Uncategorized";
}

module.exports = { classifyCategory, keywordMap };
