require("dotenv").config();
const express = require("express");
const formsgRoute = require("./routes/formsg");

const app = express();

// Capture raw body for signature validation
app.use(
  ({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);

// After rawBody is captured, parse normally
app.use(express.json({ limit: "2mb" }));

app.use("/formsg", formsgRoute);

app.get("/", (req, res) => {
  res.send("FormSG → ServiceNow Webhook Running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
