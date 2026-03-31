const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

if (typeof fetch === 'undefined') {
    console.error('Error: "fetch" is not defined. Please use Node.js v18 or higher, or install "node-fetch".');
    process.exit(1);
}

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static('public')); // Serve static files from 'public' folder

// FloraScan Analysis Engine
app.post('/api/analyze', async (req, res) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey || apiKey.trim() === "" || apiKey === "YOUR_GEMINI_API_KEY_HERE") {
            return res.status(400).json({ 
                error: { 
                    message: 'Gemini API key is not configured. Please add your working API key to the .env file to enable plant analysis.' 
                } 
            });
        }

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });

        const contentType = response.headers.get("content-type");
        let data;
        
        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            const text = await response.text();
            console.error(`[Processor Error] Expected JSON but received: ${text}`);
            return res.status(response.status).json({ 
                error: { message: `Engine returned non-JSON response. Status: ${response.status}` } 
            });
        }

        if (!response.ok) {
            console.error(`[Processor Error] Status: ${response.status}`, data);
            return res.status(response.status).json(data);
        }

        res.json(data);
    } catch (error) {
        console.error("Processor connection error:", error);
        res.status(500).json({ error: { message: 'Failed to process request. Please check your network connection.' } });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
