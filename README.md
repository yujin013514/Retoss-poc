# Retoss  
👋 Welcome to **Retoss**, a Hack the Future Google Gemini project PoC! This repository showcases a proof-of-concept for a clothing item classification system (Scanner) and a customer bidding/ranking system (Bidding System), both powered by the Google Gemini API. Built with Node.js on the server side and a simple HTML/JavaScript frontend, this project demonstrates AI-driven reverse logistic solutions.  

## Installation  
To install and run this project locally, follow these steps:  

1. Clone the repository:  
   ```bash  
   'git clone' https://github.com/your-username/Retoss.git
   'cd Retoss'

2. Install dependencies:  
    ```bash
   'npm install'  

3. Set up environment variables:  
   - In the root directory, create a `.env` file.  
   - Add your Google Gemini API key:  
     GEMINI_API_KEY=your_api_key_here  
   - Update `utils/gemini.js` to use `process.env.GEMINI_API_KEY` if needed.  

4. Start the server:  
   node app.js  

5. Open your browser and navigate to:  
   - http://localhost:3000 for the Scanner.  
   - http://localhost:3000/admin for the Bidding System dashboard.  

## Usage  
- Scanner: Allow webcam access on http://localhost:3000, select a clothing item image, and click "Next" to see Gemini classify it (e.g., "Resellable" or "Disposable").  
- Bidding System: Visit the dashboard at http://localhost:3000/admin to view a ranked list of customers with scores, discounts, and credits calculated by Gemini.  
The main logic for the Scanner is in `app.js`, while the Bidding System is handled by `utils/customerManager.js`.  

## Tech Highlights  
- Node.js
- Express.js
- Google Gemini API
- Multer (for file uploads)
- HTML/CSS/JavaScript

## Demo  
- Scanner: Capture a jacket image and watch Gemini classify it in real-time.  
- Bidding System: Call `/api/bid` to see a JSON response ranking customers, displayed on the dashboard.  

## Contributing  
1. Fork the repository.  
2. Create a branch: `git checkout -b feature-name`.  
3. Commit changes: `git commit -m "Add feature-name"`.  
4. Push to your branch: `git push origin feature-name`.  
5. Open a Pull Request!  

## License  
This project is under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.  

🚀 Happy exploring Retoss! 🌟  