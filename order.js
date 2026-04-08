document.addEventListener("DOMContentLoaded", async () => {

  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  // 🔥 фікс старого формату
  favorites = favorites.map(f => {
    if (typeof f === "string") {
      return { id: f, type: "rolls", quantity: 1 };
    }
    if (!f.type) {
      return { ...f, type: "rolls" };
    }
    return f;
  });

  localStorage.setItem("favorites", JSON.stringify(favorites));

  // тягнемо товари
  const res = await fetch("data.json");
  const data = await res.json();

  // правильний пошук
  const selectedItems = favorites.map(fav => {

    let source = [];

    if (fav.type === "rolls") source = data.rolls;
    if (fav.type === "sets") source = data.sets;
    if (fav.type === "salats") source = data.salats;

    const item = source.find(i => String(i.id) === String(fav.id));

    if (!item) return null;

    return {
      ...item,
      quantity: fav.quantity
    };

  }).filter(Boolean);

  let total = 0;
  let itemsText = "";

  selectedItems.forEach(item => {
    total += item.price * item.quantity;

    itemsText += `• ${item.name} x${item.quantity} — ${item.price * item.quantity} грн\n`;
  });

  // сума
  const totalEl = document.getElementById("total-price");
  if (totalEl) {
    totalEl.textContent = total + " грн";
  }

  // submit
  const form = document.getElementById("order-form");

  if (form) {
    form.addEventListener("submit", async function(e) {
      e.preventDefault();

      const name = document.getElementById("name").value;
      const phone = document.getElementById("phone").value;
      const city = document.getElementById("city").value;
      const street = document.getElementById("street").value;
      const time = document.getElementById("time").value;
      const persons = document.getElementById("persons").value;
      const comment = document.getElementById("comment").value;

      const message = `
🛒 НОВЕ ЗАМОВЛЕННЯ

👤 Ім'я: ${name}
📞 Телефон: ${phone}

📍 Адреса:
${city}, ${street}

⏰ Час: ${time}
👥 Осіб: ${persons}

🍣 Замовлення:
${itemsText}

💬 Коментар:
${comment || "-"}

💰 Сума: ${total} грн
`;

      try {
  const response = await fetch("https://chimi-backend.onrender.com/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: message
    })
  });

  // якщо сервер впав або не 200
  if (!response.ok) {
    throw new Error("Server error");
  }

  const data = await response.json();

  // ✅ УСПІХ
  if (data.success) {
    localStorage.removeItem("favorites");

    window.location.href = window.location.origin + "success.html";
  } else {
    window.location.href = window.location.origin + "error.html";
  }

} catch (err) {
  console.error(err);

  window.location.href = window.location.origin + "error.html";
}

    });
  }

});