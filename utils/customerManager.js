const fs = require('fs');
const { callGemini } = require('./gemini');

let customers = JSON.parse(fs.readFileSync('sampleCustomers.json', 'utf8'));
let rankedCustomers = null;

async function rankAndStackCustomers() {
  const customerDataString = customers.map(customer => `
    Customer ID: ${customer.id}
    Name: ${customer.name}
    Distance: ${customer.distance} km
    Cart adds: ${customer.cartAdds}
    Past purchases: ${customer.pastPurchases}
    Last active: ${customer.lastActive}
    Preferred category: ${customer.preferredCategory}
    Item category: ${customer.itemCategory}
    Offer status: ${customer.offerStatus}
  `).join('\n');

  const prompt = `Analyze the customer data below and rank customers by their likelihood of purchasing a clean, lightly used jacket, from highest to lowest. For each customer, return a score (0-100), a discount percentage (5-40%), and a credit amount ($0-$20). Assign lower discounts and credits to customers with higher scores, as they are more likely to purchase. Ignore the offer status for ranking and suggestions.

    Customer Data:
    ${customerDataString}

    Return the result in JSON format as a single array of customer objects, sorted by score in descending order:
    [
      {
        "id": "customer_id",
        "name": "customer_name",
        "distance": number,
        "cartAdds": number,
        "pastPurchases": number,
        "lastActive": "date",
        "preferredCategory": "category",
        "itemCategory": "category",
        "score": number,
        "discount": number,
        "credit": number,
        "reasoning": "Brief explanation of the score and suggestions"
      },
      ...
    ]
  `;

  const resultText = await callGemini(prompt);
  const rankedData = JSON.parse(resultText.substring(resultText.indexOf('['), resultText.lastIndexOf(']') + 1));

  // Use the offerStatus from sample data
  rankedCustomers = rankedData.map(ranked => {
    const original = customers.find(c => c.id === ranked.id);
    return {
      ...ranked,
      offerStatus: original.offerStatus
    };
  });

  const stack = [];
  for (let i = 0; i < rankedCustomers.length; i++) {
    stack.push(rankedCustomers[i]);
    if (rankedCustomers[i].offerStatus === "Accepted") {
      break;
    }
  }
  return stack;
}

module.exports = { rankAndStackCustomers };