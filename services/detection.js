const { parseISO, differenceInDays } = require("date-fns");

/**
 * Parses raw transactions array
 * Groups by merchant and detects subscriptions based on regular intervals & similar amounts
 */
function detectSubscriptions(data) {
  const merchantGroups = {};

  // Group by merchant
  data.forEach((tx) => {
    // Basic normalization of merchant name
    const mName = tx.merchant ? tx.merchant.trim() : "Unknown";
    if (!merchantGroups[mName]) {
      merchantGroups[mName] = [];
    }
    // ensure amount is number
    merchantGroups[mName].push({ ...tx, amount: Number(tx.amount) });
  });

  const subscriptions = [];

  Object.keys(merchantGroups).forEach((merchant) => {
    // Sort descending by date
    const txs = merchantGroups[merchant].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (txs.length >= 2) {
      let isRecurring = true;
      let intervals = [];

      for (let i = 0; i < txs.length - 1; i++) {
        const d1 = parseISO(txs[i].date);
        const d2 = parseISO(txs[i + 1].date);
        const daysDiff = differenceInDays(d1, d2);
        
        // Allowed intervals: ~ monthly (28-33 days) or ~ yearly (360-370 days)
        if (!((daysDiff >= 27 && daysDiff <= 33) || (daysDiff >= 360 && daysDiff <= 370))) {
           isRecurring = false;
        } else {
           intervals.push(daysDiff);
        }
        
        // Similar amount (within 5% difference)
        const amt1 = txs[i].amount;
        const amt2 = txs[i+1].amount;
        if (Math.abs(amt1 - amt2) / Math.max(amt1, amt2) > 0.05) {
           isRecurring = false;
        }
      }

      if (isRecurring && intervals.length > 0) {
         const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
         const frequency = avgInterval > 100 ? "yearly" : "monthly";
         subscriptions.push({
            id: `sub_${merchant.replace(/\s/g, "")}`,
            name: merchant,
            amount: txs[0].amount, // Latest amount
            category: txs[0].category || "Uncategorized", // Can be overridden by categorization service later
            frequency: frequency,
            lastPaid: txs[0].date
         });
      }
    } else if (txs.length === 1 && txs[0].amount > 500 && (txs[0].category === "Software" || String(txs[0].merchant).toLowerCase().includes("prime"))) {
      // Edge case: single large sub identified by heuristics
      subscriptions.push({
         id: `sub_${merchant.replace(/\s/g, "")}`,
         name: merchant,
         amount: txs[0].amount,
         category: txs[0].category || "Uncategorized",
         frequency: "yearly",
         lastPaid: txs[0].date
      });
    }
  });

  return subscriptions;
}

module.exports = { detectSubscriptions };
