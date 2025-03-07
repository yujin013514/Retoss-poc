const express = require('express');
const multer = require('multer');
const { callGemini } = require('./utils/gemini');
const { rankAndStackCustomers } = require('./utils/customerManager');

const app = express();
const port = 3000;

const upload = multer({ storage: multer.memoryStorage() });

app.use(express.static(__dirname));

const CLASSIFICATION_PROMPT = `
Analyze the provided image of a clothing item and classify it into one of four categories: Resellable, Refurbishable, Recyclable, or Disposable. Use these criteria:
- Resellable: Clean, lightly used, undamaged.
- Refurbishable: Minor damage or wear, repairable.
- Recyclable: Worn out but recyclable materials.
- Disposable: Heavily damaged, unusable.

Return JSON: { "category": "Resellable | Refurbishable | Recyclable | Disposable", "reasoning": "Explanation" }
Ensure that the JSON is valid by escaping any double quotes (") within the reasoning string with a backslash (\").
`;

app.post('/api/scan', upload.single('photo'), async function(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });
    const resultText = await callGemini(CLASSIFICATION_PROMPT, req.file.buffer.toString('base64'));
    const jsonString = resultText.match(/{[\s\S]*}/)?.[0];
    if (!jsonString) throw new Error('Invalid JSON format');
    res.json(JSON.parse(jsonString));
  } catch (error) {
    res.status(500).json({ error: 'Image processing failed: ' + error.message });
  }
});

app.post('/api/bid', async function(req, res) {
  try {
    const customers = await rankAndStackCustomers();
    if (!customers || customers.length === 0) {
      return res.json({ customers: [], message: 'No customers available' });
    }
    res.json({ customers: customers });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers: ' + error.message });
  }
});

app.get('/admin', function(req, res) {
  res.sendFile(__dirname + '/dashboard.html');
});

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.listen(port, function() {
  console.log('Server is running on http://localhost:' + port);
});