const formsg = require('@opengovsg/formsg-sdk')({ mode: 'production' });

module.exports = function verifySignature(req) {
  try {
    const header = req.headers['x-formsg-signature'];
    const body = JSON.stringify(req.body);
    return formsg.webhooks.verifySignature(
      process.env.FORM_SECRET_KEY,
      body,
      header
    );
  } catch (e) {
    console.error('Signature validation failed', e);
    return false;
  }
};