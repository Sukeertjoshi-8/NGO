// firebase_function.js
// Firebase v2 Cloud Function: Disaster Report Verifier using Gemini Vision
// Trigger: Firestore onDocumentCreated → reports/{reportId}

"use strict";

require("dotenv").config();

const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const admin = require("firebase-admin");

// ─── Initialize Firebase Admin ───────────────────────────────────────────────
admin.initializeApp();
const db = admin.firestore();

// ─── Gemini Client ────────────────────────────────────────────────────────────
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ─── System Prompt ────────────────────────────────────────────────────────────
const SYSTEM_PROMPT =
  'You are a crisis verification AI. Examine the provided image and the user text description carefully. ' +
  'Determine whether the image is consistent with the text description of the reported disaster. ' +
  'Respond ONLY with a valid JSON object — no markdown, no code fences, no extra text. ' +
  'The JSON must have exactly three keys: ' +
  '"confidence_score" (a whole number from 1 to 100 indicating how confident you are that the image matches the description), ' +
  '"is_verified" (a boolean — set to true when confidence_score is greater than 70, otherwise false), ' +
  'and "reasoning" (one concise sentence explaining your conclusion). ' +
  'Example of the exact format to use: ' +
  '{"confidence_score": 87, "is_verified": true, "reasoning": "The image shows visible fire and smoke consistent with the reported house fire."}';


// ─── Core Analysis Helper (reused by test.js) ─────────────────────────────────
/**
 * Fetches an image from a URL and runs it through Gemini Vision with the
 * provided text description.
 *
 * @param {string} imageUrl   - Publicly accessible URL of the disaster image
 * @param {string} description - User-supplied text description of the incident
 * @returns {Promise<{confidence_score: number, is_verified: boolean, reasoning: string}>}
 */
async function analyzeReportWithGemini(imageUrl, description) {
  // Fetch image bytes from the public URL
  const imageResponse = await fetch(imageUrl);
  if (!imageResponse.ok) {
    throw new Error(
      `Failed to fetch image. HTTP status: ${imageResponse.status}`
    );
  }

  const imageBuffer = await imageResponse.arrayBuffer();
  const base64Image = Buffer.from(imageBuffer).toString("base64");
  const mimeType =
    imageResponse.headers.get("content-type") || "image/jpeg";

  // Gemini model with JSON response enforcement
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
    },
    systemInstruction: SYSTEM_PROMPT,
  });

  // Build the multimodal prompt (image + text)
  const result = await model.generateContent([
    {
      inlineData: {
        mimeType,
        data: base64Image,
      },
    },
    {
      text: `User Description: "${description}"`,
    },
  ]);

  const rawText = result.response.text();

  // Parse and validate the JSON response
  const parsed = JSON.parse(rawText);

  if (
    typeof parsed.confidence_score !== "number" ||
    typeof parsed.is_verified !== "boolean" ||
    typeof parsed.reasoning !== "string"
  ) {
    throw new Error(
      `Gemini returned an unexpected JSON shape: ${rawText}`
    );
  }

  return parsed;
}

// ─── Firebase v2 Cloud Function ───────────────────────────────────────────────
exports.verifyReportTrigger = onDocumentCreated(
  "reports/{reportId}",
  async (event) => {
    const snap = event.data;
    const { reportId } = event.params;
    const data = snap.data();

    console.log(`[verifyReportTrigger] New report created: ${reportId}`);

    // ── Extract required fields ──────────────────────────────────────────────
    const description = data?.description;
    const imageUrl = data?.media?.image_url;

    if (!description || !imageUrl) {
      console.warn(
        `[verifyReportTrigger] Missing description or image_url for report ${reportId}. Skipping.`
      );
      await snap.ref.update({
        ai_analysis: null,
        status: "Failed",
        ai_error: "Missing required fields: description or media.image_url",
        ai_processed_at: admin.firestore.FieldValue.serverTimestamp(),
      });
      return;
    }

    try {
      // ── Run Gemini Analysis ────────────────────────────────────────────────
      console.log(
        `[verifyReportTrigger] Sending to Gemini for report ${reportId}…`
      );
      const analysis = await analyzeReportWithGemini(imageUrl, description);

      console.log(
        `[verifyReportTrigger] Gemini result for ${reportId}:`,
        JSON.stringify(analysis)
      );

      // ── Update Firestore document ──────────────────────────────────────────
      await snap.ref.update({
        ai_analysis: {
          confidence_score: analysis.confidence_score,
          is_verified: analysis.is_verified,
          reasoning: analysis.reasoning,
        },
        status: analysis.is_verified ? "Verified" : "Rejected",
        ai_processed_at: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(
        `[verifyReportTrigger] Document ${reportId} updated → status: ${
          analysis.is_verified ? "Verified" : "Rejected"
        }`
      );
    } catch (err) {
      // ── Error path: update document with failure state ─────────────────────
      console.error(
        `[verifyReportTrigger] Error processing report ${reportId}:`,
        err
      );

      await snap.ref.update({
        ai_analysis: null,
        status: "Failed",
        ai_error: err.message || "Unknown error during AI analysis",
        ai_processed_at: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
  }
);

// Export helper for reuse in test.js
module.exports.analyzeReportWithGemini = analyzeReportWithGemini;
