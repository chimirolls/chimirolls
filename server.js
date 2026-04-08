const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const TOKEN = "8763525647:AAG3cF6wkyMzIAJlpn_b3-840-1j7QBNPTg";
const CHAT_ID = "522177924";

app.post("/order", async (req, res) => {
  const { message } = req.body;

  try {
    fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    chat_id: CHAT_ID,
    text: message
  })
}).catch(err => console.error(err));

// 🔥 ВІДПОВІДАЄМО ОДРАЗУ
res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// 🔥 ВАЖЛИВО ДЛЯ RENDER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log("Server running"));