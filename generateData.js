const fs = require("fs");
const { subDays, format } = require("date-fns");

const transactions = [];
let idCounter = 1;

// Define some recurring subscriptions
const subscriptions = [
  { name: "Netflix", amount: 199, category: "Entertainment", frequencyDays: 30 },
  { name: "Spotify", amount: 119, category: "Entertainment", frequencyDays: 30 },
  { name: "Amazon Prime", amount: 1499, category: "Entertainment", frequencyDays: 365 },
  { name: "Cult Fit", amount: 1500, category: "Fitness", frequencyDays: 30 },
  { name: "Adobe CC", amount: 4230, category: "Software", frequencyDays: 30 },
  { name: "Disney+ Hotstar", amount: 299, category: "Entertainment", frequencyDays: 30 },
  { name: "Jio Fiber", amount: 1180, category: "Utilities", frequencyDays: 30 },
];

const today = new Date();

// Generate recurring transactions for the past 6 months
subscriptions.forEach((sub) => {
  let occurences = sub.frequencyDays === 365 ? 1 : 6;
  for (let i = 0; i < occurences; i++) {
    const d = subDays(today, i * sub.frequencyDays + Math.floor(Math.random() * 2)); // slight variance
    transactions.push({
      id: idCounter++,
      date: format(d, "yyyy-MM-dd"),
      amount: sub.amount,
      merchant: sub.name,
      category: sub.category,
    });
  }
});

// Define some random merchants
const randomMerchants = [
  { name: "Uber", categories: ["Transport"] },
  { name: "Zomato", categories: ["Food"] },
  { name: "Swiggy", categories: ["Food"] },
  { name: "Amazon", categories: ["Shopping"] },
  { name: "Flipkart", categories: ["Shopping"] },
  { name: "Blinkit", categories: ["Groceries"] },
  { name: "Shell Petrol", categories: ["Fuel"] },
  { name: "Dmart", categories: ["Groceries"] },
  { name: "Starbucks", categories: ["Food"] },
];

// Generate 80 random transactions in the past 180 days
for (let i = 0; i < 80; i++) {
  const rm = randomMerchants[Math.floor(Math.random() * randomMerchants.length)];
  const randomAmount = Math.floor(Math.random() * 2000) + 50;
  const d = subDays(today, Math.floor(Math.random() * 180));
  transactions.push({
    id: idCounter++,
    date: format(d, "yyyy-MM-dd"),
    amount: randomAmount,
    merchant: rm.name,
    category: rm.categories[0],
  });
}

// Sort by date descending
transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

fs.writeFileSync("data.json", JSON.stringify(transactions, null, 2));
console.log("data.json generated with", transactions.length, "transactions");
