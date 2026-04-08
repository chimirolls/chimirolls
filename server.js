const express = require("express");
const cors = require("cors");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();

app.use(cors());
app.use(express.json());

const TOKEN = "8763525647:AAG3cF6wkyMzIAJlpn_b3-840-1j7QBNPTg"; // встав свій новий
const CHAT_ID = "522177924";

app.post("/order", async (req, res) => {
  const { message } = req.body;

  try {
    await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message
      })
    });

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "error" });
  }
});

app.listen(3000, () => console.log("Server running on 3000"));