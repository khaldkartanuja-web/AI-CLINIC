# Complete AI Receptionist System

Welcome to your complete AI Receptionist System for Clinics & Shops!
This project uses **100% Free and Open-Source Technologies** and runs entirely locally.

## Project Structure Overview

```
c:\Users\khald\Desktop\my project\
│
├── backend/               # Node.js + Express API + SQLite Database
│   ├── ai-module.js       # Connects to local Ollama Llama 3
│   ├── server.js          # REST API endpoints
│   ├── db.js              # SQLite Configuration
│   └── package.json
│
├── web-dashboard/         # Vite + React (Doctor/Shopkeeper Dashboard)
│   ├── src/App.jsx        # Dashboard logic, Counter AI Voice Chat
│   └── package.json
│
└── mobile-app/            # React Native with Expo (Customer App)
    ├── api.js             # API connection to backend
    ├── App.js             # Mobile App Navigation
    ├── screens/
    │   ├── VoiceChatScreen.js  # Mobile Text/Voice AI screen
    │   └── ... (Other existing screens)
    └── package.json
```

---

## 🚀 Setup Instructions

Follow these steps exactly to get everything running on your machine.

### Step 1: Install Ollama & Llama 3 (The AI Brain)
1. Download **Ollama** from `ollama.com` and install it.
2. Open your terminal (PowerShell or Command Prompt) and run:
   ```bash
   ollama pull llama3
   ```
3. Keep Ollama running in the background. It will expose a free local API at `http://localhost:11434`.

### Step 2: Run the Backend (Database & AI API)
The backend manages your patient data, appointments, and connects to the AI.

1. Open a new terminal inside the `backend` folder:
   ```bash
   cd "c:\Users\khald\Desktop\my project\backend"
   npm install
   ```
2. Start the server:
   ```bash
   npm start
   ```
   *You should see:* `Backend AI API running at http://localhost:3000`

### Step 3: Run the Web Dashboard
The web dashboard is for the Receptionist Counter, Doctor, or Shop Owner.

1. Open a new terminal inside the `web-dashboard` folder:
   ```bash
   cd "c:\Users\khald\Desktop\my project\web-dashboard"
   npm install
   ```
2. Start the Vite React app:
   ```bash
   npm run dev
   ```
3. Open the link provided (usually `http://localhost:5173`) in your browser.
4. **Counter Mode:** Inside the web dashboard, go to the "Counter AI" tab. You can select English or Hindi, click the Microphone button, and safely talk to a shop customer directly (Speech-to-Text). The AI will process their request and answer aloud!

### Step 4: Run the Mobile App
The mobile app handles patient alarms, records, and mobile chat.

1. Open a new terminal inside the `mobile-app` folder:
   ```bash
   cd "c:\Users\khald\Desktop\my project\mobile-app"
   npm install
   ```
2. Start Expo:
   ```bash
   npx expo start
   ```
3. Press `a` to run on Android Emulator or scan the QR code using the Expo Go app.

---

## 🌟 Features Included

- **Multilingual Counter AI:** The Web Dashboard uses your computer's microphone to listen to English or Hindi. The AI replies via voice directly to walk-in patients.
- **Data Structuring:** The Llama 3 model is strictly prompted to return structured JSON `{"intent": "book", "data_extracted": {...}}`, ensuring accurate bookings in your SQLite database.
- **Services & Medicine Lists:** The backend `db.js` creates an `inventory` table. If a user asks "Do you have Paracetamol?", the AI parses intent, the server queries the database, and dynamically injects the answer into the AI response.
- **Offline / Local Data:** 0% paid APIs used. Data is stored entirely in SQLite.
- **Notifications:** Expo push notifications handle alarms exactly 1-hour before the booked appointment time.
