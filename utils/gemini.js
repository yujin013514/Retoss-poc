const axios = require('axios');

const GEMINI_API_KEY = 'AIzaSyDXbf2zVhsTno2WgUr3cKvfKv-AO0puTu8'; // Replace with your actual Gemini API key
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

async function callGemini(prompt, imageBase64 = null) {
  const parts = [{ text: prompt }];
  if (imageBase64) parts.push({ inlineData: { mimeType: 'image/jpeg', data: imageBase64 } });

  try {
    const response = await axios.post(
      GEMINI_API_URL,
      { contents: [{ parts }] },
      { params: { key: GEMINI_API_KEY } }
    );
    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    throw new Error('Gemini API Error: ' + error.message);
  }
}

module.exports = { callGemini };