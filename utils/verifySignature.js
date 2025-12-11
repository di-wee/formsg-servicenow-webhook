const crypto = require("crypto");

module.exports = function verifySignature(req) {
  try {
    const rawBody = req.rawBody; // MUST come from express raw body middleware
    const signatureHeader = req.headers["x-formsg-signature"];
    const secretKey = process.env.FORM_SECRET_KEY;

    if (!rawBody || !signatureHeader || !secretKey) {
      console.error("Missing required fields for signature check");
      return false;
    }

    // Compute HMAC
    const computedSignature = crypto
      .createHmac("sha256", secretKey)
      .update(rawBody)
      .digest("base64");

    return computedSignature === signatureHeader;
  } catch (err) {
    console.error("Signature validation failed:", err);
    return false;
  }
};
