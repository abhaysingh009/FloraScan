# FloraScan 🌿

FloraScan is a professional plant care toolkit powered by AI. It uses advanced image recognition to diagnose plant diseases, identify species, and provide expert care recommendations.

## 🚀 Features
- **Smart Diagnostics**: Instant diagnosis of plant issues via photo.
- **Expert Care System**: Personalized watering, propagation, and treatment advice.
- **Plant Care Assistant**: Interactive chatbot for any plant-related questions.
- **Health Scanner**: Fast scanning of plant leaves for early detection of issues.
- **Mobile Responsive**: Works perfectly on both desktop and mobile devices.

## 🛠️ Technology Stack
- **Frontend**: HTML5, CSS3 (Modern Glassmorphism Design), JavaScript
- **Backend**: Node.js (Express)
- **AI Engine**: Google Gemini 2.0 Flash

## 📦 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/florascan.git
   cd florascan
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Open `.env` and add your **Gemini API Key**.
   - You can get a free key from [Google AI Studio](https://aistudio.google.com/).

4. **Start the server**:
   ```bash
   npm start
   ```
   The app will be running at `http://localhost:3000`.

## 📂 Project Structure
```text
FloraScan/
├── public/                 # Frontend assets
│   ├── css/               # Stylesheets
│   ├── js/                # Client-side logic
│   ├── index.html         # Landing page
│   ├── home.html          # Core features dashboard
│   ├── health_scanner.html # AI plant scanning
│   ├── health_diagnosis.html # Detailed diagnosis
│   └── care_expert.html   # AI care recommendations
├── server.js               # Node.js backend & AI proxy
├── .env.example            # Environment variables template
├── .gitignore             # Git ignore configuration
├── package.json           # Project dependencies
└── README.md               # Project documentation
```

## 📄 License
This project is licensed under the ISC License.

## 👨‍🌾 Contributing
Contributions are welcome! Feel free to open issues or submit pull requests.

---
Made with ❤️ for plant lovers. 🌿
