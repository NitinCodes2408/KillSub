/**
 * Calculates monthly and yearly totals, and category breakdowns.
 */
function generateAnalytics(subscriptions) {
  let totalMonthly = 0;
  let totalYearly = 0;
  const categoryBreakdown = {};

  subscriptions.forEach((sub) => {
    const monthlyAmt = sub.frequency === "monthly" ? sub.amount : Math.round(sub.amount / 12);
    totalMonthly += monthlyAmt;
    totalYearly += sub.frequency === "monthly" ? sub.amount * 12 : sub.amount;

    if (!categoryBreakdown[sub.category]) {
      categoryBreakdown[sub.category] = 0;
    }
    categoryBreakdown[sub.category] += monthlyAmt;
  });

  // Format data for Recharts (Pie Chart)
  const pieData = Object.keys(categoryBreakdown).map(k => ({
    name: k,
    value: categoryBreakdown[k],
  }));

  // Bar Chart mock data (past spending + next prediction)
  const barData = [
     { name: "Oct", spending: totalMonthly > 500 ? totalMonthly - 500 : totalMonthly },
     { name: "Nov", spending: totalMonthly + 100 },
     { name: "Dec", spending: totalMonthly + 400 },
     { name: "Jan", spending: totalMonthly + 200 },
     { name: "Feb", spending: totalMonthly },
     { name: "Mar", spending: totalMonthly },
  ];

  return {
    totalMonthly,
    totalYearly,
    categoryBreakdown: pieData,
    trendData: barData
  };
}

module.exports = { generateAnalytics };
