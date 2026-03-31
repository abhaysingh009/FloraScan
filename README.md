# 🌱 FloraScan

FloraScan is a simple and user-friendly plant analysis web application. It allows users to upload plant images and get insights about plant health, condition, and basic care recommendations.

---

## 🚀 Features

- **Image Upload**: Upload plant images for analysis
- **Plant Analysis**: Get plant name, health status, and condition
- **Care Suggestions**: Basic recommendations for plant care
- **Plant Assistant**: Chatbot for plant-related queries
- **Responsive Design**: Works on both desktop and mobile devices

---

## ⚠️ Note

This project uses external AI APIs (such as Google Gemini) for plant analysis.

* An API key is required for full functionality
* Without an API key, some features may not work as expected

---

## 🛠️ Tech Stack

* **Frontend**: HTML, CSS, JavaScript
* **Backend**: Node.js (Express)
* **AI (Optional)**: Google Gemini API

---

## 📦 Installation & Setup

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/florascan.git
cd florascan
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure Environment Variables (Optional)**

* Copy `.env.example` to `.env`

```bash
cp .env.example .env
```

* Add your API key:

```env
GEMINI_API_KEY=your_key_here
```

4. **Run the project**

```bash
npm start
```

- Open in browser:

```
http://localhost:3000
```

---

## 📂 Project Structure

```
FloraScan/
├── public/
│   ├── css/
│   ├── js/
│   ├── index.html
│   ├── home.html
│   ├── health_scanner.html
│   ├── health_diagnosis.html
│   └── care_expert.html
├── server.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 👨‍💻 Developed By

* Abhay Pratap Singh
* Aman Kumar Singh

---

## 📄 License

This project is licensed under the ISC License.

---

🌿 Made for learning and demonstration purposes.
