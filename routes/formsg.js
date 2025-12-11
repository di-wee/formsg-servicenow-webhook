const express = require('express');
const router = express.Router();
const verifySignature = require('../utils/verifySignature');
const sendToSN = require('../utils/servicenow');

router.post('/webhook', async (req, res) => {
  try {
    if (!verifySignature(req)) {
      return res.status(401).send('Invalid signature');
    }

    const submission = req.body.data?.responses || [];
    const formatted = {};

    const get = (fieldName) => {
      const f = submission.find((f) => f.question.trim() === fieldName.trim());
      return f ? f.answer : '';
    };

    formatted.name = get('Name');
    formatted.description = get('Description');
    formatted.unique_number = get('Unique Number');

    const snResponse = await sendToSN(formatted);

    res.status(200).send({ status: 'success', snResponse });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err.message });
  }
});

module.exports = router;