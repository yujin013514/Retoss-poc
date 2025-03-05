const express = require('express'); // Imports Express to create a web server
const multer = require('multer'); // Imports Multer to handle file uploads
const axios = require('axios'); // Imports Axios to make HTTP requests to Gemini API
const app = express(); // Creates an Express app
const port = 3000; // Port number for the server

const GEMINI_API_KEY = 'AIzaSyDXbf2zVhsTno2WgUr3cKvfKv-AO0puTu8'; // Replace with your Gemini API key from Google AI Studio
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'; // Gemini API endpoint

const upload = multer({ storage: multer.memoryStorage() }); // Sets up Multer to store files in memory

app.use(express.static(__dirname)); // Serves static files (like index.html) from the current directory

app.post('/api/scan', upload.single('photo'), async (req, res) => { // Handles POST requests to /api/scan
  try {
    const imageBase64 = req.file.buffer.toString('base64'); // Converts the uploaded image to base64
    const prompt = `Describe the item in this image and determine if it can be resold. 
                   Conditions: Must be clean and undamaged. End with "Resellable" or "Not Resellable".`; // Prompt for Gemini API

    const response = await axios.post( // Sends a request to Gemini API
      GEMINI_API_URL,
      {
        contents: [
          {
            parts: [
              { text: prompt }, // The text prompt
              { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } }, // The image data
            ],
          },
        ],
      },
      {
        headers: { 'Content-Type': 'application/json' },
        params: { key: GEMINI_API_KEY },
      }
    );

    const result = response.data.candidates[0].content.parts[0].text; // Gets the response from Gemini
    res.json({ result }); // Sends the result back to the client
  } catch (error) {
    res.status(500).json({ result: 'Error: ' + error.message }); // Handles errors
  }
});

app.listen(port, () => { // Starts the server
    console.log(`Server is running on http://localhost:${port}`);
  });