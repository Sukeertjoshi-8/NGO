// test.js
// Local harness to test the Gemini Vision analysis logic without Firebase.
// Uses a LOCAL image file (test_image.png) to avoid any external URL dependencies.
// Usage: node test.js

"use strict";

const fs = require("fs");
const path = require("path");

// Load environment variables from .env first
require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

// ─── Gemini Client ────────────────────────────────────────────────────────────
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ─── Same system prompt as firebase_function.js ───────────────────────────────
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

// ─── Test Inputs ──────────────────────────────────────────────────────────────
const TEST_IMAGE_PATH = path.join(__dirname, "test_image.png");
const TEST_DESCRIPTION = "Major house fire";

// ─── Core Analysis (local-file version) ──────────────────────────────────────
async function analyzeLocalImage(imagePath, description) {
  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = imageBuffer.toString("base64");
  const ext = path.extname(imagePath).toLowerCase();
  const mimeType = ext === ".png" ? "image/png" : "image/jpeg";

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: { responseMimeType: "application/json" },
    systemInstruction: SYSTEM_PROMPT,
  });

  const result = await model.generateContent([
    { inlineData: { mimeType, data: base64Image } },
    { text: `User Description: "${description}"` },
  ]);

  const rawText = result.response.text();
  const parsed = JSON.parse(rawText);

  if (
    typeof parsed.confidence_score !== "number" ||
    typeof parsed.is_verified !== "boolean" ||
    typeof parsed.reasoning !== "string"
  ) {
    throw new Error(`Unexpected JSON shape from Gemini: ${rawText}`);
  }

  return parsed;
}

// ─── Run the Test ─────────────────────────────────────────────────────────────
(async () => {
  console.log("════════════════════════════════════════════════════════════");
  console.log("  Cepheus · Disaster Report Verifier — Local Test Runner");
  console.log("════════════════════════════════════════════════════════════\n");

  console.log("🖼️  Image File  :", TEST_IMAGE_PATH);
  console.log("📝 Description :", TEST_DESCRIPTION);
  console.log("\n⏳ Sending to Gemini 2.5 Flash…\n");

  try {
    const result = await analyzeLocalImage(TEST_IMAGE_PATH, TEST_DESCRIPTION);

    console.log("✅ Gemini Analysis Complete!\n");
    console.log("── Raw JSON Result ──────────────────────────────────────");
    console.log(JSON.stringify(result, null, 2));
    console.log("─────────────────────────────────────────────────────────\n");

    console.log(`🔎 Confidence Score : ${result.confidence_score}/100`);
    console.log(
      `✔️  Is Verified      : ${result.is_verified} → Status would be: "${
        result.is_verified ? "Verified" : "Rejected"
      }"`
    );
    console.log(`💬 Reasoning        : ${result.reasoning}`);
    console.log("\n════════════════════════════════════════════════════════════");
  } catch (err) {
    console.error("\n❌ Test FAILED with error:\n");
    console.error(err.message || err);
    console.error(
      "\nTip: Make sure your real GEMINI_API_KEY is set in the .env file."
    );
    process.exit(1);
  }
})();

