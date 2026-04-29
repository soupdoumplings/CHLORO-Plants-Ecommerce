const express = require("express");
const crypto = require("crypto");
const router = express.Router();

const ESEWA_SECRET = process.env.ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q";
const ESEWA_PRODUCT_CODE = process.env.ESEWA_PRODUCT_CODE || "EPAYTEST";

// Helper: generate HMAC-SHA256 signature
function generateSignature(message, secret) {
  return crypto
    .createHmac("sha256", secret)
    .update(message)
    .digest("base64");
}

// POST /api/payment/initiate
router.post("/initiate", async (req, res) => {
  try {
    const { amount, orderId } = req.body;

    const taxAmount = 0;
    const totalAmount = amount; // adjust if you have tax/service charges

    const message = `total_amount=${totalAmount},transaction_uuid=${orderId},product_code=${ESEWA_PRODUCT_CODE}`;
    const signature = generateSignature(message, ESEWA_SECRET);

    res.json({
      success: true,
      data: {
        amount: amount,
        tax_amount: taxAmount,
        total_amount: totalAmount,
        transaction_uuid: orderId,
        product_code: ESEWA_PRODUCT_CODE,
        product_service_charge: 0,
        product_delivery_charge: 0,
        success_url: `${process.env.BASE_URL}/payment/success`,
        failure_url: `${process.env.BASE_URL}/payment/failure`,
        signed_field_names: "total_amount,transaction_uuid,product_code",
        signature,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/payment/verify
router.post("/verify", async (req, res) => {
  try {
    const { encodedData } = req.body;

    // eSewa returns base64 encoded JSON
    const decoded = JSON.parse(
      Buffer.from(encodedData, "base64").toString("utf-8")
    );

    const {
      total_amount,
      transaction_uuid,
      product_code,
      signed_field_names,
      signature,
    } = decoded;

    // Re-generate signature to verify
    const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
    const expectedSignature = generateSignature(message, ESEWA_SECRET);

    if (expectedSignature !== signature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    // ✅ Payment verified — update your DB here
    // await db.query("UPDATE orders SET status = 'paid' WHERE id = $1", [transaction_uuid]);

    res.json({ success: true, data: decoded });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;