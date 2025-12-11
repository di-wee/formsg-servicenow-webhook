const axios = require('axios');

module.exports = async function sendToServiceNow(data) {
  const url = `${process.env.SERVICENOW_INSTANCE}/api/now/table/${process.env.SERVICENOW_TABLE}`;

  const auth = Buffer.from(
    `${process.env.SERVICENOW_USERNAME}:${process.env.SERVICENOW_PASSWORD}`
  ).toString('base64');

  const payload = {
    u_full_name: data.name,
    u_inmate_no: data.unique_number,
    u_short_description: data.description
  };

  const response = await axios.post(url, payload, {
    headers: {
      "Authorization": `Basic ${auth}`,
      "Content-Type": "application/json"
    }
  });

  return response.data;
};
