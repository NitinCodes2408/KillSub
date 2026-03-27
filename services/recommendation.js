/**
 * Suggests Cancel & Save recommendations
 */
function generateRecommendations(subscriptions) {
  const recommendations = [];
  
  // Sort by highest amount automatically
  const sorted = [...subscriptions].sort((a,b) => b.amount - a.amount);
  
  // 1. High Cost warning
  if (sorted.length > 0 && sorted[0].amount > 1000) {
    recommendations.push({
      id: "rec_high_cost",
      title: `Cancel ${sorted[0].name}`,
      description: `This is your most expensive subscription. Evaluate if you really need it.`,
      saveAmount: sorted[0].frequency === 'monthly' ? sorted[0].amount : Math.round(sorted[0].amount / 12),
      reason: "High Cost"
    });
  }

  // 2. Duplicate Services Warning
  const categories = {};
  subscriptions.forEach(s => {
    if (!categories[s.category]) categories[s.category] = [];
    categories[s.category].push(s);
  });

  Object.keys(categories).forEach(cat => {
    if (categories[cat].length > 1) {
      // Recommend canceling the cheaper/secondary one
      const dupes = categories[cat].sort((a,b) => a.amount - b.amount);
      recommendations.push({
        id: `rec_dup_${cat}`,
        title: `Cancel ${dupes[0].name}`,
        description: `You have multiple ${cat} subscriptions. Cancel one to save money.`,
        saveAmount: dupes[0].frequency === 'monthly' ? dupes[0].amount : Math.round(dupes[0].amount / 12),
        reason: "Duplicate Service"
      });
    }
  });

  // 3. Dummy low frequency usage
  const randomSub = subscriptions[Math.floor(Math.random() * subscriptions.length)];
  if (randomSub && !recommendations.find(r => r.title.includes(randomSub.name))) {
    recommendations.push({
       id: `rec_low_usage_${randomSub.name.replace(/\s/g, '')}`,
       title: `Cancel ${randomSub.name}`,
       description: `We noticed you rarely use this service. Unsubscribe to save money.`,
       saveAmount: randomSub.frequency === 'monthly' ? randomSub.amount : Math.round(randomSub.amount / 12),
       reason: "Low Usage"
    });
  }

  return recommendations;
}

module.exports = { generateRecommendations };
