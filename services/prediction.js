/**
 * Generates future cost projections
 */
function getPredictions(totalMonthly) {
  const oneYearCost = totalMonthly * 12;
  const fiveYearCost = totalMonthly * 12 * 5;

  return {
    oneYear: oneYearCost,
    fiveYear: fiveYearCost
  };
}

module.exports = { getPredictions };
