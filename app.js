require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const formsgRoute = require('./routes/formsg');

const app = express();
app.use(bodyParser.json({ limit: '1mb' }));

app.use('/formsg', formsgRoute);

app.get('/', (req, res) => {
  res.send('FormSG → ServiceNow Webhook Running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));