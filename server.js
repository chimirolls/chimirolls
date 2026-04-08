const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const TOKEN = "8763525647:AAG3cF6wkyMzIAJlpn_b3-840-1j7QBNPTg";
const CHAT_ID = "-5123015810";

app.post("/order", (req, res) => {
  const { message } = req.body;

  // 🔥 Відправляємо в Telegram БЕЗ await
  fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: message
    })
  })
  .then(response => response.json())
  .then(data => console.log("Telegram OK:", data))
  .catch(err => console.error("Telegram error:", err));

  // 🔥 Відповідаємо клієнту ОДРАЗУ
  res.json({ success: true });
});

// 🔥 ВАЖЛИВО ДЛЯ RENDER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log("Server running"));