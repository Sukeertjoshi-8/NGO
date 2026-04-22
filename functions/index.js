const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });
const crypto = require("crypto");

admin.initializeApp();

exports.submitReport = onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed. Use POST." });
    }

    try {
      const { base64_image, urgency_category, description, lat, lng } = req.body;
      
      const report_id = crypto.randomUUID();
      const timestamp = new Date().toISOString();
      let image_url = "";
      let has_image = false;

      if (base64_image) {
        const bucket = admin.storage().bucket();
        // Strip data URI prefix if present
        const base64Data = base64_image.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");
        const file = bucket.file(`reports/${report_id}.jpg`);
        
        await file.save(buffer, {
          metadata: { contentType: "image/jpeg" },
          public: true // Note: Requires Fine-Grained ACLs enabled on your storage bucket
        });
        
        image_url = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
        has_image = true;
      }

      const documentData = {
        report_id: report_id,
        timestamp: timestamp,
        urgency_category: urgency_category,
        description: description,
        location: {
          lat: Number(lat),
          lng: Number(lng)
        },
        media: {
          image_url: image_url,
          has_image: has_image
        },
        ai_analysis: {
          confidence_score: 0,
          is_verified: false,
          reasoning: "Pending verification"
        },
        status: "Pending"
      };

      await admin.firestore().collection("reports").doc(report_id).set(documentData);

      return res.status(200).json({ report_id });
    } catch (error) {
      console.error("Error processing disaster report:", error);
      return res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  });
});
