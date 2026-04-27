# 🛡️ KAVACH - AI Disaster Triage Command Center

**Disaster Response, Reimagined.** Kavach is an end-to-end, cross-platform emergency response system that uses Google's Gemini Vision AI to instantly triage incoming public distress reports and push them to a live command dashboard.

## 🚀 The Vision
During a crisis, response time is everything. Traditional emergency lines get overwhelmed, and dispatchers struggle to verify the severity of calls. Kavach solves this by allowing citizens to submit geo-tagged images of disasters. Our Node.js backend intercepts the payload, feeds it to **Gemini 2.5 Flash** for instant severity analysis (0-100 score + categorization), and pushes it in real-time to a dark-mode React Command Center for NGO dispatchers.

## ✨ Key Features
* **Live Public Reporting:** Frictionless web form capturing Base64 image data and precise GPS coordinates.
* **Automated AI Triage:** Integrated Gemini Vision AI analyzes disaster photos to assign severity scores and categories (Fire, Flood, Medical, etc.) without human intervention.
* **Real-Time Command Dashboard:** A sleek, React-powered live feed listening to Firebase Firestore. Reports appear instantly as they are processed.
* **Cross-Platform Ready:** Built as a responsive PWA and deployable as a native Android APK via Capacitor.

## 🛠️ Tech Stack
* **Frontend:** React (Vite), Tailwind CSS
* **Backend:** Node.js, Express.js
* **Database:** Firebase Firestore (Real-time listeners & Admin SDK)
* **AI Processing:** Google Generative AI (`gemini-2.5-flash`)
* **Mobile Wrapper:** Ionic Capacitor

---

## 💻 Local Setup Instructions

### 1. Clone the Repository
```bash
git clone [https://github.com/Sukeertjoshi-8/NGO.git](https://github.com/Sukeertjoshi-8/NGO.git)
cd NGO

2. Backend Setup (The AI Brain)

You will need your own Firebase Service Account key and a Google Gemini API Key.
Bash

# Navigate to the backend directory
cd functions/functions

# Install dependencies
npm install

# IMPORTANT: Setup Auth
# 1. Place your Firebase 'serviceAccountKey.json' in this folder.
# 2. Add your GEMINI_API_KEY to the index.js environment.

# Start the Express server
node index.js

The server will boot on http://localhost:3000.


3. Frontend Setup (The Command Center)
Bash

# Open a new terminal and navigate to the project root
cd NGO

# Install dependencies
npm install

# Start the Vite development server
npm run dev

Access the app at http://localhost:5173.



📱 Mobile APK Generation

We use Capacitor to wrap the React web app into a native Android application.
Bash

npm run build
npx cap sync
npx cap open android

(Requires Android Studio to compile the final .apk file).
⚠️ Security Note

For production environments, ensure all Firebase Service Account keys are removed from source control and managed via secure environment variables.


***

**Hackathon Tip:** If you have any screenshots of the dark-mode dashboard or the phone UI, upload them to your GitHub repo and add them to this README right under "The Vision" section. Visuals win hackathons! 

Go crush that presentation!
