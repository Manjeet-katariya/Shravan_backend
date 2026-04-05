const express = require("express");
const router = express.Router();

const { verifySMTP, sendOTP } = require("../utils/emailService");

// Test SMTP connection
router.get("/verify", async (req, res) => {
  const result = await verifySMTP();

  res.json({
    smtp: result ? "Working ✅" : "Failed ❌"
  });
});

// Send test email (OTP)
router.get("/send", async (req, res) => {
  try {
    const result = await sendOTP("katariyamanjeet017@gmail.com", "123456");

    res.json(result);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;