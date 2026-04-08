document.addEventListener("DOMContentLoaded", async () => {

  // Отримуємо дані з локального сховища (favorites)
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  // Фіксуємо старий формат, якщо він є
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

  // Тягнемо товари з data.json
  const res = await fetch("data.json");
  const data = await res.json();

  // Обробка вибраних товарів
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

  // Обчислюємо суму і формуємо текст замовлення
  let total = 0;
  let itemsText = "";

  selectedItems.forEach(item => {
    total += item.price * item.quantity;
    itemsText += `• ${item.name} x${item.quantity} — ${item.price * item.quantity} грн\n`;
  });

  // Встановлюємо загальну суму
  const totalEl = document.getElementById("total-price");
  if (totalEl) {
    totalEl.textContent = total + " грн";
  }

  // Отримуємо форму і додаємо обробник події на submit
  const form = document.getElementById("order-form");

  if (form) {
    form.addEventListener("submit", async function(e) {
      e.preventDefault(); // Зупиняємо стандартну відправку форми

      const name = document.getElementById("name").value;
      const phone = document.getElementById("phone").value;
      const city = document.getElementById("city").value;
      const street = document.getElementById("street").value;
      const time = document.getElementById("time").value;
      const persons = document.getElementById("persons").value;
      const comment = document.getElementById("comment").value;

      // Формуємо повідомлення для надсилання на сервер
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

        // 👉 НЕ ЧЕКАЄМО JSON
        if (response.ok) {
          localStorage.removeItem("favorites"); // Очищаємо локальне сховище
          window.location.href = "success.html"; // Перехід на сторінку успіху
        } else {
          window.location.href = "error.html"; // Перехід на сторінку помилки
        }

      } catch (err) {
        console.error(err);
        window.location.href = "error.html"; // Перехід на сторінку помилки
      }
    });
  }

  // Обробка кнопки відправки форми
  const submitButton = document.getElementById("submit-button");
  const loadingSpinner = document.getElementById("loading-spinner");

  submitButton.addEventListener("click", function(e) {
    // Зупиняємо багатократне натискання
    e.preventDefault();

    // Показуємо індикатор завантаження
    loadingSpinner.style.display = "inline-block";

    // Дизейбл кнопки
    submitButton.disabled = true;
    submitButton.textContent = "Надсилається...";

    // Відправляємо форму
    form.submit(); // Це дозволяє відправити форму після обробки
  });

});