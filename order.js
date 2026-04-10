document.addEventListener("DOMContentLoaded", async function() {
  // Вибір між доставкою та самовивозом
  const deliveryBtn = document.getElementById("delivery-btn");
  const pickupBtn = document.getElementById("pickup-btn");
  const deliveryForm = document.getElementById("delivery-form");
  const pickupForm = document.getElementById("pickup-form");

  // Початково показуємо форму доставки
  deliveryForm.style.display = "block";
  pickupForm.style.display = "none"; // Приховуємо форму самовивозу за замовчуванням
  deliveryBtn.classList.add("active"); // За замовчуванням активна кнопка "Доставка"

  // Обробка вибору кнопки Доставка
  deliveryBtn.addEventListener("click", function() {
    deliveryForm.style.display = "block";
    pickupForm.style.display = "none";
    deliveryBtn.classList.add("active"); // Додаємо клас active
    pickupBtn.classList.remove("active"); // Видаляємо клас active з іншої кнопки
  });

  // Обробка вибору кнопки Самовивіз
  pickupBtn.addEventListener("click", function() {
    deliveryForm.style.display = "none";
    pickupForm.style.display = "block";
    pickupBtn.classList.add("active"); // Додаємо клас active
    deliveryBtn.classList.remove("active"); // Видаляємо клас active з іншої кнопки
  });

  // Обробка зміни села для доставки
  const selectCity = document.getElementById("city");
  const otherCityWrapper = document.getElementById("other-city-wrapper");

  selectCity.addEventListener("change", function() {
    if (selectCity.value === "Інше") {
      otherCityWrapper.style.display = "block";
    } else {
      otherCityWrapper.style.display = "none";
    }
  });

  // Обробка кнопок кількості персон
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

  // Обробка кнопок кількості навчальних паличок
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

  // Логіка для соєвого соусу
  const decrementSoySauceButton = document.querySelector("#soy-sauce-counter .decrement");
  const incrementSoySauceButton = document.querySelector("#soy-sauce-counter .increment");
  const soySauceCountDisplay = document.getElementById("soy-sauce-count");

  let soySauceCount = parseInt(soySauceCountDisplay.textContent);

  decrementSoySauceButton.addEventListener("click", function() {
    if (soySauceCount > 0) {
      soySauceCount--;
      soySauceCountDisplay.textContent = soySauceCount;
    }
  });

  incrementSoySauceButton.addEventListener("click", function() {
    soySauceCount++;
    soySauceCountDisplay.textContent = soySauceCount;
  });

  // Логіка для імбиру
  const decrementGingerButton = document.querySelector("#ginger-counter .decrement");
  const incrementGingerButton = document.querySelector("#ginger-counter .increment");
  const gingerCountDisplay = document.getElementById("ginger-count");

  let gingerCount = parseInt(gingerCountDisplay.textContent);

  decrementGingerButton.addEventListener("click", function() {
    if (gingerCount > 0) {
      gingerCount--;
      gingerCountDisplay.textContent = gingerCount;
    }
  });

  incrementGingerButton.addEventListener("click", function() {
    gingerCount++;
    gingerCountDisplay.textContent = gingerCount;
  });

  // Логіка для васабі
  const decrementWasabiButton = document.querySelector("#wasabi-counter .decrement");
  const incrementWasabiButton = document.querySelector("#wasabi-counter .increment");
  const wasabiCountDisplay = document.getElementById("wasabi-count");

  let wasabiCount = parseInt(wasabiCountDisplay.textContent);

  decrementWasabiButton.addEventListener("click", function() {
    if (wasabiCount > 0) {
      wasabiCount--;
      wasabiCountDisplay.textContent = wasabiCount;
    }
  });

  incrementWasabiButton.addEventListener("click", function() {
    wasabiCount++;
    wasabiCountDisplay.textContent = wasabiCount;
  });


  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  // 🔥 Фікс старого формату
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

  // Сума
  const totalEl = document.getElementById("total-price");
  if (totalEl) {
    totalEl.textContent = total + " грн";
  }

  // Обробка відправки форми
  const form = document.getElementById("order-form");
  form.addEventListener("submit", async function(e) {
    e.preventDefault();

    const loadingModal = document.getElementById("loading-modal");
    loadingModal.style.display = "flex";  // Показуємо індикатор завантаження

    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    let city = "";
    let street = "";
    let time = "";

    // Отримуємо дані про замовлення
    if (deliveryForm.style.display === "block") {
      city = document.getElementById("city").value;
      if (city === "Інше") {
        city = document.getElementById("other-city").value; // Якщо вибрано "Інше", додаємо значення
      }
      street = document.getElementById("street").value;
      time = document.getElementById("time").value;
    } else {
      time = document.getElementById("pickup-time").value;
    }

    const persons = document.getElementById("person-count").textContent;
    const sticks = document.getElementById("stick-count").textContent;
    const soySauce = document.getElementById("soy-sauce-count").textContent;
    const ginger = document.getElementById("ginger-count").textContent;
    const wasabi = document.getElementById("wasabi-count").textContent;
    const comment = document.getElementById("comment").value;
  

    // Сума вже обчислюється в функції calculateTotal
    const total = await calculateTotal(); // Беремо значення суми

    const message = `
🛒 НОВЕ ЗАМОВЛЕННЯ

👤 Ім'я: ${name}
📞 Телефон: ${phone}

Тип замовлення: ${deliveryForm.style.display === "block" ? "Доставка" : "Самовивіз"}

${deliveryForm.style.display === "block" ? `
📍 Адреса:
Село: ${city}
Вулиця: ${street}` : ""}

🍣 Замовлення:
${itemsText}

⏰ Час: ${time}
👥 Звичайні персон: ${persons}
🍡 Навчальні палички: ${sticks}

🍣 Додаткові інгредієнти:
- Соєвий соус: ${soySauce} порцій
- Імбир: ${ginger} порцій
- Васабі: ${wasabi} порцій

💬 Коментар: ${comment || "-"}
💰 Сума: ${total} грн
`;

    try {
      console.log("Відправка запиту на сервер...");  // Логування перед відправкою запиту
      const response = await fetch("https://chimi-backend.onrender.com/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: message
        })
      });

      // Перевіряємо відповідь сервера
      if (!response.ok) {
        throw new Error(`Помилка від сервера: ${response.statusText}`);
      }

      const responseData = await response.json();
      console.log("Відповідь від сервера:", responseData);  // Логування відповіді

      if (responseData.success) {
        localStorage.removeItem("favorites");
        window.location.href = "success.html"; // Перехід на сторінку успіху
      } else {
        throw new Error("Помилка при обробці замовлення");
      }
    } catch (err) {
      console.error("Помилка при надсиланні запиту:", err);
      window.location.href = "error.html"; // Перехід на сторінку помилки
    } finally {
      loadingModal.style.display = "none";  // Сховуємо індикатор після завершення
    }
  });
});

async function calculateTotal() {
  let total = 0;
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const res = await fetch("data.json");
  const data = await res.json();

  favorites.forEach(fav => {
    let source = [];
    if (fav.type === "rolls") source = data.rolls;
    if (fav.type === "sets") source = data.sets;
    if (fav.type === "salats") source = data.salats;

    const item = source.find(i => String(i.id) === String(fav.id));
    if (item) {
      total += item.price * fav.quantity;
    }
  });

  return total;
}

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

// Логіка для соєвого соусу
const decrementSoySauceButton = document.querySelector("#soy-sauce-counter .decrement");
const incrementSoySauceButton = document.querySelector("#soy-sauce-counter .increment");
const soySauceCountDisplay = document.getElementById("soy-sauce-count");

let soySauceCount = parseInt(soySauceCountDisplay.textContent);

decrementSoySauceButton.addEventListener("click", function() {
  if (soySauceCount > 0) {
    soySauceCount--;
    soySauceCountDisplay.textContent = soySauceCount;
  }
});

incrementSoySauceButton.addEventListener("click", function() {
  soySauceCount++;
  soySauceCountDisplay.textContent = soySauceCount;
});

// Логіка для імбиру
const decrementGingerButton = document.querySelector("#ginger-counter .decrement");
const incrementGingerButton = document.querySelector("#ginger-counter .increment");
const gingerCountDisplay = document.getElementById("ginger-count");

let gingerCount = parseInt(gingerCountDisplay.textContent);

decrementGingerButton.addEventListener("click", function() {
  if (gingerCount > 0) {
    gingerCount--;
    gingerCountDisplay.textContent = gingerCount;
  }
});

incrementGingerButton.addEventListener("click", function() {
  gingerCount++;
  gingerCountDisplay.textContent = gingerCount;
});

// Логіка для васабі
const decrementWasabiButton = document.querySelector("#wasabi-counter .decrement");
const incrementWasabiButton = document.querySelector("#wasabi-counter .increment");
const wasabiCountDisplay = document.getElementById("wasabi-count");

let wasabiCount = parseInt(wasabiCountDisplay.textContent);

decrementWasabiButton.addEventListener("click", function() {
  if (wasabiCount > 0) {
    wasabiCount--;
    wasabiCountDisplay.textContent = wasabiCount;
  }
});

incrementWasabiButton.addEventListener("click", function() {
  wasabiCount++;
  wasabiCountDisplay.textContent = wasabiCount;
});