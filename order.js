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

  // Тягнемо товари
  const res = await fetch("data.json");
  const data = await res.json();

  // Правильний пошук
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

      // Додаємо індикатор завантаження
      const loadingModal = document.getElementById("loading-modal");
      loadingModal.style.display = "flex"; // Показуємо модальне вікно

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

        if (response.ok) {
          localStorage.removeItem("favorites");
          window.location.href = "success.html"; // Перехід на сторінку успіху
        } else {
          window.location.href = "error.html"; // Перехід на сторінку помилки
        }

      } catch (err) {
        console.error(err);
        window.location.href = "error.html"; // Перехід на сторінку помилки
      } finally {
        // Після завершення відправки закриваємо модальне вікно
        loadingModal.style.display = "none";
      }
    });
  }

});

// Показати поле для іншого села
document.addEventListener("DOMContentLoaded", function() {
  const selectCity = document.getElementById("city");
  const otherCityWrapper = document.getElementById("other-city-wrapper");

  selectCity.addEventListener("change", function() {
    if (selectCity.value === "Інше") {
      // Показуємо поле для іншого села
      otherCityWrapper.style.display = "block";
    } else {
      // Ховаємо поле для іншого села
      otherCityWrapper.style.display = "none";
    }
  });
});

// Кількість персон
document.addEventListener("DOMContentLoaded", function() {
  const decrementPersonButton = document.querySelector("#person-counter .decrement");
  const incrementPersonButton = document.querySelector("#person-counter .increment");
  const personCountDisplay = document.getElementById("person-count");
  
  let personCount = parseInt(personCountDisplay.textContent);

  decrementPersonButton.addEventListener("click", function() {
    if (personCount > 1) {
      personCount--;
      personCountDisplay.textContent = personCount;
    }
  });

  incrementPersonButton.addEventListener("click", function() {
    personCount++;
    personCountDisplay.textContent = personCount;
  });

  // Навчальні палички
  const decrementStickButton = document.querySelector("#stick-counter .decrement");
  const incrementStickButton = document.querySelector("#stick-counter .increment");
  const stickCountDisplay = document.getElementById("stick-count");
  
  let stickCount = parseInt(stickCountDisplay.textContent);

  decrementStickButton.addEventListener("click", function() {
    if (stickCount > 0) {
      stickCount--;
      stickCountDisplay.textContent = stickCount;
    }
  });

  incrementStickButton.addEventListener("click", function() {
    stickCount++;
    stickCountDisplay.textContent = stickCount;
  });
});