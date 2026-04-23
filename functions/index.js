require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const path = require('path');
const serviceAccount = require(path.join(__dirname, 'serviceAccountKey.json'));

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();

// Configure Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Essential for Base64 image transfers

// Initialize Gemini
// NOTE: Set GEMINI_API_KEY in your environment, or paste it directly here.
const genAI = new GoogleGenerativeAI("AIzaSyCI73FP56T0Ll9PZw2EBUUlxl2Mc0OqoCA");

// Root Health Check Route
app.get('/', (req, res) => {
  res.send('Server is Alive');
});

// Create the Route
app.post('/submitReport', async (req, res) => {
  console.log("🚨 [BACKEND] NEW REPORT RECEIVED!");
  try {
    const { urgency_category, description, lat, lng, base64_image } = req.body;

    // 1. Initial save to Firestore
    const docRef = await admin.firestore().collection('reports').add({
      urgency_category,
      description,
      lat,
      lng,
      image_data: base64_image,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log("✅ [BACKEND] FIRESTORE SAVE SUCCESS. ID:", docRef.id);

    // 2. Automated AI Analysis Pipeline
    if (base64_image) {
      try {
        console.log("🧠 [BACKEND] SENDING TO GEMINI AI...");
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const promptText = "Analyze this disaster photo. Give me a severity score 0-100 and category (Fire, Flood, Medical, Accident). Return ONLY JSON: { 'severity': number, 'category': 'string' }";

        // Strip the Prefix
        const rawBase64 = base64_image.includes(',') ? base64_image.split(',')[1] : base64_image;

        // Format for Gemini
        const imagePart = {
          inlineData: {
            data: rawBase64,
            mimeType: "image/jpeg"
          }
        };
        const result = await model.generateContent([promptText, imagePart]);
        const response = await result.response;
        const text = response.text();

        // Attempt to parse the JSON response
        let ai_analysis = {};
        try {
          const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
          ai_analysis = JSON.parse(jsonString);
        } catch (parseError) {
          console.log("Could not parse AI response as JSON. Raw text:", text);
        }

        console.log("Gemini Exact Response:", text);

        // Map severity to score to match the requested update syntax
        const score = ai_analysis.severity || 0;

        // Update Firestore with the AI Analysis and completion status
        await docRef.update({
          ai_analysis: {
            ...ai_analysis,
            severity: score,
            status: 'complete'
          }
        });
        console.log(`AI Analysis completed for report ${docRef.id}`);
      } catch (aiError) {
        console.error("❌ [BACKEND] GEMINI ERROR:", aiError);
        await docRef.update({ ai_analysis: { status: 'failed' } });
      }
    }

    return res.status(200).json({
      success: true,
      report_id: docRef.id
    });
  } catch (error) {
    console.error("Error submitting report:", error);
    return res.status(500).json({ error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 CROSS-PLATFORM SERVER LIVE ON PORT ${PORT}`);
});
