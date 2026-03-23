# 🏥 SmartClinic AI Receptionist (Smart-Clinic-OS)

A professional, "live-demo ready" AI operating system for clinics. This project transforms a basic receptionist system into a high-impact, intelligent platform with voice awareness, multi-language support, and advanced clinic intelligence tools.

![SmartClinic Preview](https://img.shields.io/badge/Status-Demo--Ready-success?style=for-the-badge&logo=ai&color=2563eb)
![Tech Stack](https://img.shields.io/badge/Stack-Node.js%20|%20SQLite%20|%20Ollama-blue?style=for-the-badge)

---

## 🌟 Key Features

### 🏥 Medical-Grade Staff Dashboard
- **Structured Data Display**: No raw JSON. Clean, labeled cards for Patients, Appointments, Doctors, and Call Logs.
- **Live Waiting Queue**: Real-time visualization of "Serving Now" and "Up Next" patients.
- **Clinic Intelligence Feed**: AI-driven suggestions for clinic optimization and patient outreach.
- **Sentiment Analysis**: Automatic sentiment tagging (`URGENT`, `ANXIOUS`, `POSITIVE`) for call summaries.

### 🎤 Intelligent Voice Receptionist (Patient Interface)
- **Natural Voice Conversations**: Full STT (Speech-to-Text) and TTS (Text-to-Speech) capabilities.
- **Interactive Feedback**: Real-time "Listening..." and "Thinking..." indicators for a life-like experience.
- **Empathetic Triage**: AI recognizes symptoms (fever, pain, etc.) and provides basic medical precautions before offering appointment booking.

### 🗺️ Full Multi-Language Support
- Natively supports **English**, **Hindi (हिंदी)**, and **Marathi (मराठी)**.
- Unified language switcher that updates both the UI and AI response logic instantly.

### 📋 Essential Admin Tools
- **Digital Receipts**: One-click professional PDF-style receipt generation.
- **Appointment Reminders**: Instant notification system for scheduled patients.
- **Live Search**: Real-time filtering across thousands of patient records.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: Clean HTML5, Vanilla CSS3 (Professional Light Theme), JavaScript (ES6+).
- **Backend**: Node.js, Express.
- **Database**: SQLite (Local, Lightweight).
- **AI/LLM Engine**: Ollama (Llama 3 base) with hybrid Regex-parsing for high reliability.
- **Voice Engine**: Web Speech API (STT & TTS).

---

## 🚀 Getting Started

### Prerequisites
1.  **Node.js** (v16+)
2.  **Ollama** (Download from [ollama.com](https://ollama.com))
    - Run `ollama pull llama3` to get the base model.

### Installation
1.  Clone the repository:
    ```bash
    git clone https://github.com/khaldkartanuja-web/AI-RECEPTIONLIST.git
    cd AI-RECEPTIONLIST
    ```
2.  Install dependencies for both root and backend:
    ```bash
    npm install
    cd backend && npm install
    ```
3.  Start the backend server:
    ```bash
    cd backend && node server.js
    ```
4.  Open `index.html` or `landing.html` in your browser (Chrome recommended for Voice API).

---

## 👨‍💻 Project Competition Ready
This system is optimized for **live demonstrations** and **college/hackathon competitions**:
1.  **WOW Factor**: The "Live Intelligence" dashboard proves high-level features.
2.  **Reliability**: The hybrid AI engine ensures commands are understood even if the LLM has locally high latency.
3.  **Clean Code**: Modular structure for easy extension.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Developed for **khaldkartanuja-web/AI-RECEPTIONLIST**.
