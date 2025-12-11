const express = require("express");
const verifySignature = require("../utils/verifySignature");
const sendToServiceNow = require("../utils/sendToServiceNow");

const router = express.Router();

router.post("/webhook", async (req, res) => {
  console.log("🔥 Webhook received");

  // 1) Signature validation
  const valid = verifySignature(req);
  if (!valid) {
    console.error("❌ Invalid signature");
    return res.status(403).json({ error: "Invalid signature" });
  }

  console.log("✔ Signature valid");

  // 2) Extract FormSG responses
  const body = req.body;
  const responses = body?.data?.responses || [];

  function findField(name) {
    const f = responses.find((r) =>
      r.question.toLowerCase().includes(name.toLowerCase())
    );
    return f?.answer || null;
  }

  const mapped = {
    name: findField("name"),
    description: findField("description"),
    unique_number: findField("unique number"),
  };

  console.log("📦 Mapped payload:", mapped);

  // 3) Send to ServiceNow
  try {
    const result = await sendToServiceNow(mapped);
    console.log("✔ Created record in ServiceNow:", result);
    res.json({ status: "success" });
  } catch (err) {
    console.error("❌ Failed to send to ServiceNow:", err);
    res.status(500).json({ error: "ServiceNow error" });
  }
});

module.exports = router;
